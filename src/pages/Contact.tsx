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

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

type ContactForm = z.infer<typeof schema>;

export default function Contact() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactForm>({ resolver: zodResolver(schema) });

  const onSubmit = async (_data: ContactForm) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    setSent(true);
    reset();
  };

  return (
    <Layout>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-white">Contact Us</h1>
          <p className="mt-3 text-muted-foreground">Have a question, suggestion, or issue? We'd love to hear from you.</p>
        </div>

        {sent ? (
          <div className="bg-card border border-primary/30 rounded-2xl p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Message Received</h2>
            <p className="text-muted-foreground text-sm mb-6">Thank you for reaching out. We'll respond within 3 business days.</p>
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm text-muted-foreground">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    placeholder="Jane Smith"
                    className="bg-secondary/50 border-border focus:border-primary"
                    {...register('name')}
                    data-testid="input-name"
                  />
                  {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm text-muted-foreground">
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="jane@example.com"
                    className="bg-secondary/50 border-border focus:border-primary"
                    {...register('email')}
                    data-testid="input-email"
                  />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm text-muted-foreground">
                  Subject <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="subject"
                  placeholder="What's this about?"
                  className="bg-secondary/50 border-border focus:border-primary"
                  {...register('subject')}
                  data-testid="input-subject"
                />
                {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm text-muted-foreground">
                  Message <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell us more..."
                  rows={6}
                  className="bg-secondary/50 border-border focus:border-primary resize-none"
                  {...register('message')}
                  data-testid="textarea-message"
                />
                {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
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
                ) : 'Send Message'}
              </Button>
            </form>
          </div>
        )}

        <div className="mt-8 bg-card border border-border rounded-xl p-5">
          <p className="text-sm text-muted-foreground text-center">
            Typical response time is 1–3 business days. For bug reports, please include your browser name and version for faster resolution.
          </p>
        </div>
      </div>
    </Layout>
  );
}
