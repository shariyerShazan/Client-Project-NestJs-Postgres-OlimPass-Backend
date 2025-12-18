import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MembershipMailService {
private transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,       // 465 for secure, 587 for TLS
  secure: true,    // true if port 465
  auth: {
    user: process.env.EMAIL_USER!,
    pass: process.env.EMAIL_PASS!, // App Password
  },
});


  async sendMembershipEmail(to: string, name: string, membershipId: string) {
    await this.transporter.sendMail({
      from: `"Olim Pass" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Welcome! Your Olim Pass Membership ID',
      html: `
             <div style="
                width: 100%;
                background-color: #f4f4f4;
                padding: 40px 0;
                font-family: Arial, sans-serif;
                ">
                <div style="
                    max-width: 500px;
                    margin: auto;
                    background: #ffffff;
                    border-radius: 10px;
                    padding: 30px;
                    box-shadow: 0px 4px 15px rgba(0,0,0,0.1);
                    text-align: center;
                ">
                    
                    <h2 style="
                    color: #333333;
                    margin-bottom: 10px;
                    font-size: 24px;
                    ">
                    Welcome, ${name}! 🎉
                    </h2>

                    <p style="
                    color: #555555;
                    font-size: 15px;
                    line-height: 22px;
                    margin-bottom: 20px;
                    ">
                    Your membership has been created successfully!
                    </p>

                    <div style="
                    background: #f8f8f8;
                    border-radius: 8px;
                    padding: 15px;
                    margin-top: 20px;
                    border-left: 4px solid #F80B58;
                    ">
                    <p style="
                        font-size: 16px;
                        margin: 0;
                        color: #333333;
                    ">
                        <b>Your Membership ID:</b>  
                    </p>
                    
                    <p style="
                        font-size: 22px;
                        color: #F80B58;
                        font-weight: bold;
                        margin: 5px 0 0 0;
                    ">
                        ${membershipId}
                    </p>
                    </div>

                    <p style="
                    color: #777777;
                    font-size: 14px;
                    margin-top: 25px;
                    line-height: 20px;
                    ">
                    Thank you for registering with us.<br/>
                    If you have any questions, feel free to contact support.
                    </p>

                </div>
                </div>

      `,
    });
    console.log("mail send!")
  }
}
