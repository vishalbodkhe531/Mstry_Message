import { resend } from "@/lib/resendEmail/resend";
import { apiResponse } from "@/types/apiResponce";
import { VerificationEmail } from "../../emails/verificationEmail";

export async function sendVarificationEmail(
  email: string,
  userName: string,
  verifiCode: string
): Promise<apiResponse> {
  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Mysty message | verification code",
    react: VerificationEmail({ userName, otp: verifiCode }),
  });

  try {
    return { success: true, message: "verification email send successfully " };
  } catch (emailError) {
    console.error("email sending verification email", emailError);
    return { success: false, message: "failed to send verification email" };
  }
}
