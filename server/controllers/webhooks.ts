import { Request, Response } from 'express';
import { verifyWebhook } from '@clerk/express/webhooks';
import User from '../models/User.js';

export const clerkWebhook = async (req: Request, res: Response) => {
  try {
    const evt = await verifyWebhook(req);

    if (evt.type === 'user.created' || evt.type === 'user.updated') {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;

      const userData = {
        clerkId: id,
        email: email_addresses?.[0]?.email_address ?? '',
        name: `${first_name ?? ''} ${last_name ?? ''}`.trim(),
        image: image_url ?? '',
      };

      const existingUser = await User.findOne({ clerkId: id });

      if (existingUser) {
        await User.findOneAndUpdate({ clerkId: id }, userData, { new: true });
      } else {
        await User.create(userData);
      }
    }

    // Bonus: handle user deletion
    if (evt.type === 'user.deleted') {
      await User.findOneAndDelete({ clerkId: evt.data.id });
    }

    return res.json({ success: true, message: 'Webhook Received' });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return res.status(400).send('Error verifying webhook');
  }
};