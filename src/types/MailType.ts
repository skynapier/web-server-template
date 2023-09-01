
export type MailType = {
    from: string;
    to: string;
    subject: string;
    text?: string;
    html?: string;
  };
  
export type MailRequest = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    note: string;

}

