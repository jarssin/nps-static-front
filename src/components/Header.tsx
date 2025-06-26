import { useConfig } from "../hooks/useConfig";

const Header = () => {
  const config = useConfig();

  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-32 h-32 mb-4 mx-auto">
        <img
          src={config.logo}
          alt={config.name}
          className="w-full h-full object-contain"
        />
      </div>
      <div className="mb-2">
        <h1
          className="text-2xl font-bold text-primary mb-1"
          style={{ fontFamily: config.theme.fontFamily.title }}
        >
          {config.texts.header.title}
        </h1>
        <h2
          className="text-3xl font-bold text-secondary mb-2"
          style={{ fontFamily: config.theme.fontFamily.subtitle }}
        >
          {config.texts.header.subtitle}
        </h2>
        <p className="text-sm text-muted-foreground uppercase tracking-wider">
          {config.texts.header.tagline}
        </p>
      </div>
    </div>
  );
};

export default Header;
