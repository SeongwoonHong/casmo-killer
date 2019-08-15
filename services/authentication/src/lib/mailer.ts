/* tslint:disable:max-line-length */
import * as sgMail from '@sendgrid/mail';

import { EmailTemplateParams } from '~lib/types';
import { configs } from '~config';

const {
  CLIENT_APP_NAME: clientAppName,
  SENDGRID_API_KEY: apiKey,
} = configs;

class AuthMailer {
  public static emailTemplate(information: EmailTemplateParams): string {
    const {
      body,
      bodyTitle,
      buttonText,
      buttonUrl,
      clientUrl = configs.CLIENT_URL,
      footerText,
      heading,
      logoAlt = configs.CLIENT_APP_URL,
      logoUrl = configs.CLIENT_LOGO_URL,
      themeColor = configs.CLIENT_THEME_COLOR,
    } = information;

    return `
      <div style="font-size:16px;background-color:#fdfdfd;margin:0;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;line-height:1.5;height:100%!important;width:100%!important;">
          <table bgcolor="#fdfdfd" width="100%" style="box-sizing:border-box;border-spacing:0;width:100%;background-color:#fdfdfd;border-collapse:separate!important">
              <tbody>
                  <tr>
                      <td valign="top" style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top">
                      </td>
                      <td valign="top" width="600" style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;display:block;width:600px;max-width:600px;margin:0 auto!important">
                          <div style="box-sizing:border-box;display:block;max-width:600px;margin:0 auto;padding:10px">
                              <span style="color:transparent;display:none;height:0;max-height:0;max-width:0;opacity:0;overflow:hidden;width:0">
                                  ${heading}
                              </span>
                              <div style="box-sizing:border-box;width:100%;margin-bottom:30px;margin-top:15px">
                                  <table
                                      width="100%"
                                      style="box-sizing:border-box;width:100%;border-spacing:0;border-collapse:separate!important">
                                      <tbody>
                                        <tr>
                                            <td align="left"
                                                style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;text-align:left"
                                                valign="top">
                                                <span class="m_-5962824116991471244sg-image">
                                                    <a
                                                        href="${clientUrl}"
                                                        style="box-sizing:border-box;color:${themeColor}};font-weight:400;text-decoration:none"
                                                        target="_blank">
                                                        <img
                                                            alt="${logoAlt}"
                                                            src="${logoUrl}"
                                                            width="123"
                                                            style="max-width:100%;border-style:none;width:123px;">
                                                    </a>
                                                </span>
                                            </td>
                                        </tr>
                                      </tbody>
                                  </table>
                              </div>
                              <div style="box-sizing:border-box;width:100%;margin-bottom:30px;background:#ffffff;border:1px solid #dedede">
                                  <table
                                      width="100%"
                                      style="box-sizing:border-box;width:100%;border-spacing:0;border-collapse:separate!important">
                                      <tbody>
                                          <tr>
                                              <td
                                                  valign="top"
                                                  style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;padding:30px">
                                                  <table
                                                      width="100%"
                                                      style="box-sizing:border-box;width:100%;border-spacing:0;border-collapse:separate!important">
                                                      <tbody>
                                                          <tr>
                                                              <td style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top"
                                                                  valign="top">
                                                                  <h2 style="margin:0;margin-bottom:30px;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-weight:300;line-height:1.5;font-size:24px;color:#616161!important">
                                                                      ${bodyTitle}
                                                                  </h2>
                                                                  <p style="margin:0;margin-bottom:30px;color:#616161;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;font-weight:300">
                                                                      ${body}
                                                                  </p>
                                                              </td>
                                                          </tr>
                                                          <tr>
                                                              <td
                                                                  valign="top"
                                                                  style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top">
                                                                  <table
                                                                      cellpadding="0"
                                                                      cellspacing="0"
                                                                      width="100%"
                                                                      style="box-sizing:border-box;border-spacing:0;width:100%;border-collapse:separate!important">
                                                                      <tbody>
                                                                          <tr>
                                                                              <td align="center"
                                                                                  valign="top"
                                                                                  style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;padding-bottom:15px">
                                                                                  <table
                                                                                      cellpadding="0"
                                                                                      cellspacing="0"
                                                                                      style="box-sizing:border-box;border-spacing:0;width:auto;border-collapse:separate!important">
                                                                                      <tbody>
                                                                                          <tr>
                                                                                              <td align="center"
                                                                                                  valign="top"
                                                                                                  bgcolor="${themeColor}"
                                                                                                  style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top;background-color:${themeColor};border-radius:2px;text-align:center">
                                                                                                  <a
                                                                                                      href="${buttonUrl}"
                                                                                                      target="_blank"
                                                                                                      style="box-sizing:border-box;border-color:${themeColor};font-weight:400;text-decoration:none;display:inline-block;margin:0;color:#ffffff;background-color:${themeColor};border:solid 1px ${themeColor};border-radius:2px;font-size:14px;padding:12px 45px">
                                                                                                      ${buttonText}
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
                              <div style="box-sizing:border-box;clear:both;width:100%">
                                  <table
                                      width="100%"
                                      style="box-sizing:border-box;width:100%;border-spacing:0;font-size:12px;border-collapse:separate!important">
                                      <tbody>
                                          <tr style="font-size:12px">
                                              <td
                                                  align="center"
                                                  valign="top"
                                                  style="box-sizing:border-box;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;vertical-align:top;font-size:12px;text-align:center;padding:20px 0">
                                                  <span style="float:none;display:block;text-align:center">
                                                      <a
                                                          href="${clientUrl}"
                                                          style="box-sizing:border-box;color:${themeColor};font-weight:400;text-decoration:none;font-size:12px"
                                                          target="_blank">
                                                          <img
                                                              alt="${logoAlt}"
                                                              src="${logoUrl}"
                                                              width="89"
                                                              style="max-width:100%;border-style:none;font-size:12px;width:89px;">
                                                      </a>
                                                  </span>
                                                  <p style="color:#616161;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;margin-bottom:5px;margin:10px 0 20px">
                                                      ${footerText}
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
                          style="box-sizing:border-box;padding:0;font-family:'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;font-size:16px;vertical-align:top">
                      </td>
                  </tr>
              </tbody>
          </table>
      </div>
  `;
  }

  public static registerConfirmData(options: any = {}): EmailTemplateParams {
    return {
      body: 'Click the following link to confirm your email address.',
      bodyTitle: 'You\'re almost done!<br>Let\'s confirm your email address.',
      buttonText: 'Confirm your email address',
      footerText: 'Place for chat on the web',
      heading: 'Let\'s confirm your email address.',
      title: `'Welcome to ${clientAppName}! Confirm Your Email Address'`,
      ...options,
    };
  }

  public static pwdResetConfirmData(options: any = {}): EmailTemplateParams {
    return {
      body: 'Click the following link to reset your password.',
      bodyTitle: 'You\'re almost done!<br>Let\'s reset your password.',
      buttonText: 'Confirm your email address',
      footerText: 'Place for chat on the web',
      heading: 'Let\'s reset your password.',
      title: `Reset Your ${clientAppName} Password`,
      ...options,
    };
  }

  private mailer;

  constructor() {
    this.mailer = sgMail;
    this.mailer.setApiKey(apiKey);
  }

  public sendRegisterConfirmation(
    to: string,
    redirect_url: string,
  ): Promise<string> {
    const data = AuthMailer.registerConfirmData({
      buttonUrl: redirect_url,
    });

    return this.sendMail(
      to,
      'Complete your Damso registration.',
      AuthMailer.emailTemplate(data),
    );
  }

  private async sendMail(
    to: string,
    subject: string,
    html: string,
  ): Promise<string> {
    await this
      .mailer
      .send({
        from: 'no-reply@yt-studio.com',
        html,
        subject,
        to,
      });

    return to;
  }
}

export const mailer = new AuthMailer();
