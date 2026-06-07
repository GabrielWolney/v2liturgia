import React from "react";

// Lista de resoluções de dispositivos Apple para Splash Screens
const splashScreens = [
  { width: 430, height: 932, ratio: 3, name: "iPhone 15 Pro Max, 14 Pro Max" },
  { width: 393, height: 852, ratio: 3, name: "iPhone 15 Pro, 15, 14 Pro" },
  { width: 428, height: 926, ratio: 3, name: "iPhone 14 Plus, 13 Pro Max, 12 Pro Max" },
  { width: 390, height: 844, ratio: 3, name: "iPhone 14, 13 Pro, 13, 12 Pro, 12" },
  { width: 375, height: 812, ratio: 3, name: "iPhone 13 mini, 12 mini, 11 Pro, X, Xs" },
  { width: 414, height: 896, ratio: 3, name: "iPhone 11 Pro Max, Xs Max" },
  { width: 414, height: 896, ratio: 2, name: "iPhone 11, Xr" },
  { width: 414, height: 736, ratio: 3, name: "iPhone 8 Plus, 7 Plus, 6s Plus, 6 Plus" },
  { width: 375, height: 667, ratio: 2, name: "iPhone 8, 7, 6s, 6, SE (2nd/3rd gen)" },
  { width: 320, height: 568, ratio: 2, name: "iPhone 5, 5s, 5c, SE (1st gen)" },
];

export function AppleSplashScreens() {
  return (
    <>
      {splashScreens.map(({ width, height, ratio }) => {
        const pixelWidth = width * ratio;
        const pixelHeight = height * ratio;
        
        return (
          // CORREÇÃO: Adicionado o ratio à chave para garantir que é sempre única!
          <React.Fragment key={`${width}-${height}-${ratio}`}>
            {/* TEMA CLARO */}
            <link
              rel="apple-touch-startup-image"
              media={`screen and (device-width: ${width}px) and (device-height: ${height}px) and (-webkit-device-pixel-ratio: ${ratio}) and (prefers-color-scheme: light)`}
              href={`/splash/light/apple-splash-${pixelWidth}-${pixelHeight}.png`}
            />
            {/* TEMA ESCURO */}
            <link
              rel="apple-touch-startup-image"
              media={`screen and (device-width: ${width}px) and (device-height: ${height}px) and (-webkit-device-pixel-ratio: ${ratio}) and (prefers-color-scheme: dark)`}
              href={`/splash/dark/apple-splash-${pixelWidth}-${pixelHeight}.png`}
            />
          </React.Fragment>
        );
      })}
    </>
  );
}