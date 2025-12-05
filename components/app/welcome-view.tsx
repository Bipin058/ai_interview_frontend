import { Button } from '@/components/livekit/button';

function WelcomeImage() {
  return <img src="/logo.png" alt="Logo" className="text-fg0 mb-4 size-16" />;
}

interface WelcomeViewProps {
  startButtonText: string;
  onStartCall: () => void;
}

export const WelcomeView = ({
  startButtonText,
  onStartCall,
  ref,
}: React.ComponentProps<'div'> & WelcomeViewProps) => {
  return (
    <div ref={ref}>
      <section className="bg-background flex flex-col items-center justify-center text-center">
        <WelcomeImage />

        <p className="text-foreground max-w-prose pt-1 leading-6 font-medium">
          join to start your Interview
        </p>
        <p className="text-foreground max-w-prose pt-1 leading-6 font-medium text-xs">
          This interview requires your microphone and camera to be on.<br></br>
          Please ensure you are in a quiet environment.
        </p>

        <Button variant="primary" size="lg" onClick={onStartCall} className="mt-6 w-64 font-mono">
          {startButtonText}
        </Button>
      </section>

      <div className="fixed bottom-5 left-0 flex w-full items-center justify-center">
        <p className="text-muted-foreground max-w-prose pt-1 text-xs leading-5 font-normal text-pretty md:text-sm">
          {/* Need help getting set up? Check out the{' '} */}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://docs.livekit.io/agents/start/voice-ai/"
            className="underline"
          >
            {/* Voice AI quickstart */}
          </a>
          .
        </p>
      </div>
    </div>
  );
};
