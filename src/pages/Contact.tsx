// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { useState } from 'react';
// import { CheckCircle, Mail } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Label } from '@/components/ui/label';
// import { Layout } from '@/components/Layout';

// const schema = z.object({
//   name: z.string().min(2, 'Name must be at least 2 characters'),
//   email: z.string().email('Please enter a valid email address'),
//   subject: z.string().min(5, 'Subject must be at least 5 characters'),
//   message: z.string().min(20, 'Message must be at least 20 characters'),
// });

// type ContactForm = z.infer<typeof schema>;

// export default function Contact() {
//   const [sent, setSent] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     reset,
//   } = useForm<ContactForm>({ resolver: zodResolver(schema) });

//   const onSubmit = async (_data: ContactForm) => {
//     await new Promise(resolve => setTimeout(resolve, 800));
//     setSent(true);
//     reset();
//   };

//   return (
//     <Layout>
//       <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
//         <div className="text-center mb-10">
//           <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
//             <Mail className="w-6 h-6 text-primary" />
//           </div>
//           <h1 className="text-4xl font-bold text-white">Contact Us</h1>
//           <p className="mt-3 text-muted-foreground">Have a question, suggestion, or issue? We'd love to hear from you.</p>
//         </div>

//         {sent ? (
//           <div className="bg-card border border-primary/30 rounded-2xl p-10 text-center">
//             <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
//               <CheckCircle className="w-8 h-8 text-primary" />
//             </div>
//             <h2 className="text-xl font-semibold text-white mb-2">Message Received</h2>
//             <p className="text-muted-foreground text-sm mb-6">Thank you for reaching out. We'll respond within 3 business days.</p>
//             <Button
//               variant="outline"
//               className="border-border hover:bg-secondary"
//               onClick={() => setSent(false)}
//               data-testid="button-send-another"
//             >
//               Send Another Message
//             </Button>
//           </div>
//         ) : (
//           <div className="bg-card border border-border rounded-2xl p-8">
//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                 <div className="space-y-2">
//                   <Label htmlFor="name" className="text-sm text-muted-foreground">
//                     Full Name <span className="text-destructive">*</span>
//                   </Label>
//                   <Input
//                     id="name"
//                     placeholder="Jane Smith"
//                     className="bg-secondary/50 border-border focus:border-primary"
//                     {...register('name')}
//                     data-testid="input-name"
//                   />
//                   {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="email" className="text-sm text-muted-foreground">
//                     Email Address <span className="text-destructive">*</span>
//                   </Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="jane@example.com"
//                     className="bg-secondary/50 border-border focus:border-primary"
//                     {...register('email')}
//                     data-testid="input-email"
//                   />
//                   {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="subject" className="text-sm text-muted-foreground">
//                   Subject <span className="text-destructive">*</span>
//                 </Label>
//                 <Input
//                   id="subject"
//                   placeholder="What's this about?"
//                   className="bg-secondary/50 border-border focus:border-primary"
//                   {...register('subject')}
//                   data-testid="input-subject"
//                 />
//                 {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="message" className="text-sm text-muted-foreground">
//                   Message <span className="text-destructive">*</span>
//                 </Label>
//                 <Textarea
//                   id="message"
//                   placeholder="Tell us more..."
//                   rows={6}
//                   className="bg-secondary/50 border-border focus:border-primary resize-none"
//                   {...register('message')}
//                   data-testid="textarea-message"
//                 />
//                 {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
//               </div>

//               <Button
//                 type="submit"
//                 className="w-full bg-primary hover:bg-primary/90 text-white h-11 font-semibold"
//                 disabled={isSubmitting}
//                 data-testid="button-submit-contact"
//               >
//                 {isSubmitting ? (
//                   <span className="flex items-center gap-2">
//                     <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
//                     Sending...
//                   </span>
//                 ) : 'Send Message'}
//               </Button>
//             </form>
//           </div>
//         )}

//         <div className="mt-8 bg-card border border-border rounded-xl p-5">
//           <p className="text-sm text-muted-foreground text-center">
//             Typical response time is 1–3 business days. For bug reports, please include your browser name and version for faster resolution.
//           </p>
//         </div>
//       </div>
//     </Layout>
//   );
  // }

  import { useForm } from 'react-hook-form';
  import { zodResolver } from '@hookform/resolvers/zod';
  import { z } from 'zod';
  import { useState } from 'react';
  import { CheckCircle, Mail } from 'lucide-react';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Textarea } from '@/components/ui/textarea';
  import { Label } from '@/components/ui/label';
  import { Layout } from '@/components/Layout';
  import SEO from '@/components/SEO';

  const schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    subject: z.string().min(5, 'Subject must be at least 5 characters'),
    message: z.string().min(20, 'Message must be at least 20 characters'),

    website: z.string().optional(),
  });

  type ContactForm = z.infer<typeof schema>;

  export default function Contact() {
    const [sent, setSent] = useState(false);
    const [formStartTime] = useState(Date.now());

    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
      reset,
    } = useForm<ContactForm>({
      resolver: zodResolver(schema),
    });

    
    const onSubmit = async (data: ContactForm) => {
      // Honeypot Check
    if (data.website) {
      alert('Spam detected');
      return;
    }

    // Minimum Fill Time
    const secondsSpent =
      (Date.now() - formStartTime) / 1000;

    if (secondsSpent < 3) {
      alert('Please fill the form properly.');
      return;
    }

    // Rate Limit
    const lastSubmit =
      localStorage.getItem('contact-last-submit');

    if (
      lastSubmit &&
      Date.now() - Number(lastSubmit) < 60000
    ) {
      alert(
        'Please wait 1 minute before sending another message.'
      );
      return;
    }

    localStorage.setItem(
      'contact-last-submit',
      Date.now().toString()
    );

      
    console.log('FORM SUBMITTED', data);
    try {
      const formData = new FormData();

      // Google Form Field IDs
      formData.append('entry.2005620554', data.name);
      formData.append('entry.1045781291', data.email);
      formData.append('entry.1065046570', data.subject);
      formData.append('entry.839337160', data.message);

      await fetch(
        'https://docs.google.com/forms/d/e/1FAIpQLSetyaLCLGZvxDjbJJ92rd7fOEAib7-iqc7j_8NHEx8Cqztjog/formResponse',
        {
          method: 'POST',
          mode: 'no-cors',
          body: formData,
        }
      );

      setSent(true);
      reset();
    } catch (error) {
      console.error('Contact form error:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  return (
    <Layout>
      <SEO
        title="Contact | RecordPilot"
        description="Contact the RecordPilot team."
        canonical="/contact"
        />
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Mail className="w-6 h-6 text-primary" />
          </div>

          <h1 className="text-4xl font-bold text-white">
            Contact Us
          </h1>

          <p className="mt-3 text-muted-foreground">
            Have a question, suggestion, or issue?
            We'd love to hear from you.
          </p>
        </div>

        {sent ? (
          <div className="bg-card border border-primary/30 rounded-2xl p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>

            <h2 className="text-xl font-semibold text-white mb-2">
              Message Received
            </h2>

            <p className="text-muted-foreground text-sm mb-6">
              Thank you for reaching out.
              We'll respond within 1–3 business days.
            </p>

            <Button
              variant="outline"
              className="border-border hover:bg-secondary"
              onClick={() => setSent(false)}
              data-testid="button-send-another"
            >
              Send Another Message
            </Button>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" >  

              <input
                type="text"
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                {...register('website')}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm text-muted-foreground"
                  >
                    Full Name{' '}
                    <span className="text-destructive">*</span>
                  </Label>

                  <Input
                    id="name"
                    placeholder="Jane Smith"
                    className="bg-secondary/50 border-border focus:border-primary"
                    {...register('name')}
                    data-testid="input-name"
                  />

                  {errors.name && (
                    <p className="text-xs text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm text-muted-foreground"
                  >
                    Email Address{' '}
                    <span className="text-destructive">*</span>
                  </Label>

                  <Input
                    id="email"
                    type="email"
                    placeholder="jane@example.com"
                    className="bg-secondary/50 border-border focus:border-primary"
                    {...register('email')}
                    data-testid="input-email"
                  />

                  {errors.email && (
                    <p className="text-xs text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="subject"
                  className="text-sm text-muted-foreground"
                >
                  Subject{' '}
                  <span className="text-destructive">*</span>
                </Label>

                <Input
                  id="subject"
                  placeholder="What's this about?"
                  className="bg-secondary/50 border-border focus:border-primary"
                  {...register('subject')}
                  data-testid="input-subject"
                />

                {errors.subject && (
                  <p className="text-xs text-destructive">
                    {errors.subject.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="message"
                  className="text-sm text-muted-foreground"
                >
                  Message{' '}
                  <span className="text-destructive">*</span>
                </Label>

                <Textarea
                  id="message"
                  placeholder="Tell us more..."
                  rows={6}
                  className="bg-secondary/50 border-border focus:border-primary resize-none"
                  {...register('message')}
                  data-testid="textarea-message"
                />

                {errors.message && (
                  <p className="text-xs text-destructive">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white h-11 font-semibold"
                disabled={isSubmitting}
                data-testid="button-submit-contact"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Sending...
                  </span>
                ) : (
                  'Send Message'
                )}
              </Button>
            </form>
          </div>
        )}

        <div className="mt-8 bg-card border border-border rounded-xl p-5">
          <p className="text-sm text-muted-foreground text-center">
            Typical response time is 1–3 business days.
            For bug reports, please include your browser name and version.
          </p>
        </div>
      </div>
    </Layout>
  );
}