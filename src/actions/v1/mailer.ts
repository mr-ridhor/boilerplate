import nodemailer from "nodemailer";
import handlebars from "nodemailer-express-handlebars";

const sendMail = async (
  email: string,
  data: any,
  subject: string,
  template: string
) => {
  // Step 1: Create a transporter object
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  // Step 2: Set up the handlebars engine
  transporter.use(
    "compile",
    handlebars({
      viewEngine: {
        extname: ".html",
        defaultLayout: false,
      },
      viewPath: `${process.cwd()}/src/views/v1/mails/`,
      extName: ".html",
    })
  );

  // Step 3: Create an email message
  const mailOptions = {
    from: `"${process.env.SITE_NAME}" <${process.env.MAIL_USERNAME}>`,
    to: email,
    subject: subject,
    template: template, // name of the handlebars template file without the extension
    context: {
      subject: subject,
      data: data,
      logo: `${process.env.SITE_LOGO}`,
    },
  };

  // Step 4: Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.error("Error sending email:", error);
    } else {
      return console.log("Email sent:", info.response);
    }
  });
};

export default sendMail;
