import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScrollToTop } from "@/components/ScrollToTop";
import Home from "@/pages/Home";
import ScreenRecorder from "@/pages/ScreenRecorder";
import AudioRecorder from "@/pages/AudioRecorder";
import VideoEditor from "@/pages/VideoEditor";
import HowItWorks from "@/pages/HowItWorks";
import Features from "@/pages/Features";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Contact from "@/pages/Contact";
import FAQ from "@/pages/FAQ";
import Disclaimer from "@/pages/Disclaimer";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/screen-recorder" component={ScreenRecorder} />
        <Route path="/audio-recorder" component={AudioRecorder} />
        <Route path="/video-editor" component={VideoEditor} />
        <Route path="/how-it-works" component={HowItWorks} />
        <Route path="/features" component={Features} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/contact" component={Contact} />
        <Route path="/faq" component={FAQ} />
        <Route path="/disclaimer" component={Disclaimer} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
