const { appUrl, logoUrl, sendGridApiKey } = process.env;

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(sendGridApiKey);

module.exports.sendEmail = (token, to, subject, html) => {

  if (process.env.NODE_ENV === 'test') {
    return Promise.resolve(to);
  }

  return sgMail
    .send({
      to,
      from: 'no-reply@damso.com',
      subject,
      html
    })
    .then(() => to);

};

module.exports.generateMessage = (information) => {
  return `
    <div style="font-size: 16px; background-color: #fdfdfd; margin: 0; padding: 0; font-family: 'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif; line-height: 1.5; height: 100% !important; width: 100% !important;">
    
        <table
            bgcolor="#fdfdfd"
            width="100%"
            style="box-sizing: border-box; border-spacing: 0; width: 100%; background-color: #fdfdfd; border-collapse: separate !important">
    
            <tbody>
    
                <tr>
    
                    <td
                        valign="top"
                        style="box-sizing: border-box; padding: 0; font-family: 'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif; font-size: 16px; vertical-align: top">
                        &nbsp;
                    </td>
    
                    <td
                        valign="top"
                        width="600"
                        style="box-sizing: border-box; padding: 0; font-family: 'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif; font-size: 16px; vertical-align: top; display: block; width: 600px; max-width: 600px; margin: 0 auto !important">
    
                        <div style="box-sizing: border-box; display: block; max-width: 600px; margin: 0 auto; padding: 10px">
                            <span style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; width: 0">
                                Let's ${information.action} your ${information.target}.
                            </span>
    
                            <div style="box-sizing: border-box; width: 100%; margin-bottom: 30px; margin-top: 15px">
    
                                <table
                                    width="100%"
                                    style="box-sizing: border-box; width: 100%; border-spacing: 0; border-collapse: separate !important">
    
                                    <tbody>
    
                                    <tr>
    
                                        <td align="left"
                                            style="box-sizing: border-box; padding: 0; font-family: 'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif; font-size: 16px; vertical-align: top; text-align: left"
                                            valign="top">
                                            <span class="m_-5962824116991471244sg-image">
                                                <a
                                                    href="${appUrl}"
                                                    style="box-sizing: border-box; color: #F06292; font-weight: 400; text-decoration: none"
                                                    target="_blank">
                                                    <img
                                                        alt="Damso"
                                                        src="${logoUrl}"
                                                        width="123"
                                                        style="max-width: 100%; border-style: none; width: 123px;">
                                                </a>
                                            </span>
                                        </td>
    
                                    </tr>
    
                                    </tbody>
    
                                </table>
    
                            </div>
    
                            <div style="box-sizing: border-box; width: 100%; margin-bottom: 30px; background: #ffffff; border: 1px solid #dedede">
    
                                <table
                                    width="100%"
                                    style="box-sizing: border-box; width: 100%; border-spacing: 0; border-collapse: separate !important">
    
                                    <tbody>
    
                                        <tr>
    
                                            <td
                                                valign="top"
                                                style="box-sizing: border-box; font-family: 'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif; font-size: 16px; vertical-align: top; padding: 30px">
    
                                                <table
                                                    width="100%"
                                                    style="box-sizing: border-box; width: 100%; border-spacing: 0; border-collapse: separate !important">
    
                                                    <tbody>
    
                                                        <tr>
    
                                                            <td style="box-sizing: border-box; padding: 0; font-family: 'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif; font-size: 16px; vertical-align: top"
                                                                valign="top">
    
                                                                <h2 style="margin: 0; margin-bottom: 30px; font-family: 'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif; font-weight: 300; line-height: 1.5; font-size: 24px; color: #616161 !important">
                                                                    You're almost done!
                                                                    <br>
                                                                    Let's ${information.action} your ${information.target}.
                                                                </h2>
    
    
                                                                <p style="margin: 0; margin-bottom: 30px; color: #616161; font-family: 'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif; font-size: 16px; font-weight: 300">
                                                                    Click the following link to ${information.action} your ${information.target}.
                                                                </p>
    
                                                            </td>
    
                                                        </tr>
    
                                                        <tr>
    
                                                            <td
                                                                valign="top"
                                                                style="box-sizing: border-box; padding: 0; font-family: 'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif; font-size: 16px; vertical-align: top">
    
                                                                <table
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    width="100%"
                                                                    style="box-sizing: border-box; border-spacing: 0; width: 100%; border-collapse: separate !important">
    
                                                                    <tbody>
    
                                                                        <tr>
    
                                                                            <td align="center"
                                                                                valign="top"
                                                                                style="box-sizing: border-box; padding: 0; font-family: 'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif; font-size: 16px; vertical-align: top; padding-bottom: 15px">
    
                                                                                <table
                                                                                    cellpadding="0"
                                                                                    cellspacing="0"
                                                                                    style="box-sizing: border-box; border-spacing: 0; width: auto; border-collapse: separate !important">
    
                                                                                    <tbody>
    
                                                                                        <tr>
    
                                                                                            <td align="center"
                                                                                                valign="top"
                                                                                                bgcolor="#F06292"
                                                                                                style="box-sizing: border-box; padding: 0; font-family: 'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif; font-size: 16px; vertical-align: top; background-color: #F06292; border-radius: 2px; text-align: center">
                                                                                                <a
                                                                                                    href="${appUrl}${information.url}"
                                                                                                    target="_blank"
                                                                                                    style="box-sizing: border-box; border-color: #F06292; font-weight: 400; text-decoration: none; display: inline-block; margin: 0; color: #ffffff; background-color: #F06292; border: solid 1px #F06292; border-radius: 2px; font-size: 14px; padding: 12px 45px">
                                                                                                    ${information.action} ${information.target}
                                                                                                </a>
                                                                                            </td>
    
                                                                                        </tr>
    
                                                                                    </tbody>
    
                                                                                </table>
    
                                                                            </td>
    
                                                                        </tr>
    
                                                                    </tbody>
    
                                                                </table>
    
                                                            </td>
    
                                                        </tr>
    
                                                    </tbody>
    
                                                </table>
    
                                            </td>
    
                                        </tr>
    
                                    </tbody>
    
                                </table>
    
                            </div>
    
                            <div style="box-sizing: border-box; clear: both; width: 100%">
    
                                <table
                                    width="100%"
                                    style="box-sizing: border-box; width: 100%; border-spacing: 0; font-size: 12px; border-collapse: separate !important">
    
                                    <tbody>
    
                                        <tr style="font-size: 12px">
    
                                            <td
                                                align="center"
                                                valign="top"
                                                style="box-sizing: border-box; font-family: 'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif; vertical-align: top; font-size: 12px; text-align: center; padding: 20px 0">
    
                                                <span style="float: none; display: block; text-align: center">
                                                    <a
                                                        href="${appUrl}"
                                                        style="box-sizing: border-box; color: #F06292; font-weight: 400; text-decoration: none; font-size: 12px"
                                                        target="_blank">
                                                        <img
                                                            alt="Damso"
                                                            src="${logoUrl}"
                                                            width="89"
                                                            style="max-width: 100%; border-style: none; font-size: 12px; width: 89px;">
                                                    </a>
                                                </span>
    
    
                                                <p style="color: #616161; font-family: 'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif; font-size: 12px; font-weight: 400; margin-bottom: 5px; margin: 10px 0 20px">
                                                    Place For Chat On The Web
                                                </p>
    
                                            </td>
    
                                        </tr>
    
                                    </tbody>
    
                                </table>
    
                            </div>
    
                        </div>
    
                    </td>
    
                    <td
                        valign="top"
                        style="box-sizing: border-box; padding: 0; font-family: 'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif; font-size: 16px; vertical-align: top">
                        &nbsp;
                    </td>
    
                </tr>
    
            </tbody>
    
        </table>
    
    </div>
  `;
};
