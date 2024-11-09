import { sendVarificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/db/dbConnection";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { userName, email, password } = await request.json();
    const existingUserVerifiedUserName = await UserModel.find({
      userName,
      isVeryfied: true,
    });

    if (existingUserVerifiedUserName) {
      return Response.json(
        { success: false, message: "UserName is already taken " },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User already exist with this email",
          },
          { status: 400 }
        );
      } else {
        const hashPassword = await bcrypt.hashSync(password, 10);
        existingUserByEmail.password = hashPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);

        await existingUserByEmail.save();
      }
    } else {
      const hashPassword = await bcrypt.hashSync(password, 10);
      const expiryData = new Date();
      expiryData.setHours(expiryData.getHours() + 1);

      const newUser = new UserModel({
        userName,
        email,
        password: hashPassword,
        verifyCode,
        verifyCodeExpiry: expiryData,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    const emailResponse = await sendVarificationEmail(
      email,
      userName,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully please verify user email",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error registering user ", error);
    return Response.json(
      { success: false, message: "Error registering user" },
      { status: 500 }
    );
  }
}
