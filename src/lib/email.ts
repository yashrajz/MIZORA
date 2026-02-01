import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const FROM_EMAIL = process.env.FROM_EMAIL || 'MIZORA <noreply@mizora.com>';
const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * Generate a random verification token
 */
export function generateVerificationToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 64; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
}

/**
 * Send verification email
 */
export async function sendVerificationEmail(
    email: string,
    fullName: string,
    token: string
): Promise<{ success: boolean; error?: string }> {
    const verifyUrl = `${SITE_URL}/verify-email?token=${token}`;

    try {
        await transporter.sendMail({
            from: FROM_EMAIL,
            to: email,
            subject: 'Verify your MIZORA account',
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8f9f0; margin: 0; padding: 40px 20px;">
    <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);">
        <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 28px; color: #4a7c59; margin: 0; font-weight: 600;">MIZORA</h1>
            <p style="color: #6b7280; font-size: 14px; margin: 4px 0 0 0;">Premium Matcha</p>
        </div>
        
        <h2 style="font-size: 24px; color: #1a1a1a; margin: 0 0 16px 0; text-align: center;">Verify Your Email</h2>
        
        <p style="color: #374151; line-height: 1.6; margin: 0 0 24px 0;">
            Hi ${fullName},
        </p>
        
        <p style="color: #374151; line-height: 1.6; margin: 0 0 24px 0;">
            Thank you for creating a MIZORA account. Please verify your email address by clicking the button below:
        </p>
        
        <div style="text-align: center; margin: 32px 0;">
            <a href="${verifyUrl}" style="display: inline-block; background-color: #4a7c59; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                Verify Email Address
            </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">
            Or copy and paste this link into your browser:
        </p>
        <p style="color: #4a7c59; font-size: 14px; word-break: break-all; margin: 0 0 24px 0;">
            ${verifyUrl}
        </p>
        
        <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0;">
            This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
        
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
            © ${new Date().getFullYear()} MIZORA. All rights reserved.
        </p>
    </div>
</body>
</html>
            `,
        });

        return { success: true };
    } catch (err) {
        console.error('Email send error:', err);
        return { success: false, error: 'Failed to send email' };
    }
}

/**
 * Send welcome email after verification
 */
export async function sendWelcomeEmail(
    email: string,
    fullName: string
): Promise<{ success: boolean; error?: string }> {
    try {
        await transporter.sendMail({
            from: FROM_EMAIL,
            to: email,
            subject: 'Welcome to MIZORA!',
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8f9f0; margin: 0; padding: 40px 20px;">
    <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);">
        <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="font-size: 28px; color: #4a7c59; margin: 0; font-weight: 600;">MIZORA</h1>
            <p style="color: #6b7280; font-size: 14px; margin: 4px 0 0 0;">Premium Matcha</p>
        </div>
        
        <h2 style="font-size: 24px; color: #1a1a1a; margin: 0 0 16px 0; text-align: center;">Welcome to MIZORA!</h2>
        
        <p style="color: #374151; line-height: 1.6; margin: 0 0 24px 0;">
            Hi ${fullName},
        </p>
        
        <p style="color: #374151; line-height: 1.6; margin: 0 0 24px 0;">
            Your email has been verified and your account is now active. You're ready to explore our premium matcha collection!
        </p>
        
        <div style="text-align: center; margin: 32px 0;">
            <a href="${SITE_URL}/products" style="display: inline-block; background-color: #4a7c59; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
                Shop Now
            </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">
        
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
            © ${new Date().getFullYear()} MIZORA. All rights reserved.
        </p>
    </div>
</body>
</html>
            `,
        });

        return { success: true };
    } catch (err) {
        console.error('Email send error:', err);
        return { success: false, error: 'Failed to send email' };
    }
}
