export default function passwordResetEmailTemplate(
  email: string,
  otpCode: string,
) {
  console.log(email, otpCode);
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="color-scheme" content="light dark">
        <meta name="supported-color-schemes" content="light dark">
        <title></title>

        <!--[if !mso]><!-->
        <style type="text/css">
    @import url('https://fonts.mailersend.com/css?family=Inter:400,600');
        </style>
        <!--<![endif]-->

        <style type="text/css" rel="stylesheet" media="all">
    @media only screen and (max-width: 640px) {
            .ms-header {
                display: none !important;
            }
            .ms-content {
                width: 100% !important;
                border-radius: 0;
            }
            .ms-content-body {
                padding: 30px !important;
            }
            .ms-footer {
                width: 100% !important;
            }
            .mobile-wide {
                width: 100% !important;
            }
            .info-lg {
                padding: 30px;
            }
        }
        </style>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
        <!--[if mso]>
                                                            <style type="text/css">
                                                            body { font-family: Arial, Helvetica, sans-serif!important  !important; }
                                                            td { font-family: Arial, Helvetica, sans-serif!important  !important; }
                                                            td * { font-family: Arial, Helvetica, sans-serif!important  !important; }
                                                            td p { font-family: Arial, Helvetica, sans-serif!important  !important; }
                                                            td a { font-family: Arial, Helvetica, sans-serif!important  !important; }
                                                            td span { font-family: Arial, Helvetica, sans-serif!important  !important; }
                                                            td div { font-family: Arial, Helvetica, sans-serif!important  !important; }
                                                            td ul li { font-family: Arial, Helvetica, sans-serif!important  !important; }
                                                            td ol li { font-family: Arial, Helvetica, sans-serif!important  !important; }
                                                            td blockquote { font-family: Arial, Helvetica, sans-serif!important  !important; }
                                                            th * { font-family: Arial, Helvetica, sans-serif!important  !important; }
                                                            </style>
                                                            <![endif]-->
    </head>
    <body style="font-family:'Inter', Helvetica, Arial, sans-serif; width: 100% !important; height: 100%; margin: 0; padding: 0; -webkit-text-size-adjust: none; background-color: #f4f7fa; color: #4a5566;">

        <div class="preheader" style="display:none !important;visibility:hidden;mso-hide:all;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;"></div>

        <table class="ms-body" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;background-color:#f4f7fa;width:100%;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;">
            <tr>
                <td align="center" style="word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;">

                    <table class="ms-container" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;">
                        <tr>
                            <td align="center" style="word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;">

                                <table class="ms-header" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                                    <tr>
                                        <td height="40" style="font-size:0px;line-height:0px;word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;">
                                            &nbsp;
                                        </td>
                                    </tr>
                                </table>

                            </td>
                        </tr>

                        <tr>
                            <td align="center" style="word-break:break-word;font-family:'Inter', Helvetica, Arial, sans-serif;font-size:16px;line-height:24px;">
                                <table class="ms-content" width="640px" height="400px" style="border-collapse:collapse;width: 640px;height:400px;background: #FDD39C">
                                    <tr>
                                        <td>
                                            <table class="ms-content" style="width: 92.5%;height: 87.5%;border-radius: 20px;border: 3px solid #FDD39C;background: #FFFFFE;margin:3.25%">
                                                <tr style="width:100%;height:100%">
                                                    <td style="width:100%;height:100%">
                                                        <table class="ms-content" style="margin:2.5% 10%;width:80%">
                                                            <tr>
                                                                <td align="center">
                                                                    <img src="https://lh3.googleusercontent.com/pw/AP1GczPsZeu8r--kWw6RiaPnIpGvJyBr-3bDEXSlOhtyMRWX3_jHy6-XOo2tlUuiN1DVuAoXLUiY2MHgu3uAYNm2yD3_u6G_RmgyLqeUR-TofNmpoF1kgNZvFVg4OF_o8Hne3OUYLGDpLq8b9mrDxrd9D-Pa3A=w120-h111-s-no-gm?authuser=0" alt="Jennifer Ann's Group Logo" title="Logo" width="55px" height="auto" style="display:block;" />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center">
                                                                    <p style="color:#2352A0;font-family:Inter;font-size:28px;font-weight:600">
                                                                        Forgot Password Code
                                                                    </p>
                                                                    <p style="color:#000;font-family:Inter;font-weight:700;font-size:18px">
                                                                        ${otpCode}
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td align="center" style="">
                                                                    <span style="color:#333;font-family:Inter;font-weight:500;font-size:11px">
                                                                        This message was sent to: <span style="color:#2352A0; font-style:italic">${email}</span>
                                                                    </span><br />
                                                                    <span style="color:#333;font-family:Inter;font-weight:500;font-size:10px">If you didn’t ask to change your password, please ignore this email.</span>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>

                </td>
            </tr>
        </table>

    </body>
    </html>
  `;
}
