import {
  ACCENTS,
  DENSITIES,
  DEFAULT_THEME,
  FONTS,
  MOTIONS,
  RADII,
  STORAGE_KEY,
} from "@/lib/theme";

/**
 * Serialised into a blocking <script> in <head>. It has to be self-contained,
 * so the theme tables are injected as JSON rather than imported.
 *
 * Only the CSS driven tokens are applied here, because that is all that can
 * flash. The background settings feed shader uniforms and are resolved later by
 * React, so this script only needs to tolerate the longer hash, not parse it.
 */
export function themeInitScript() {
  const tables = JSON.stringify({
    ACCENTS,
    FONTS,
    RADII,
    DENSITIES,
    MOTIONS,
    DEFAULT_THEME,
  });

  return `(function(){try{
var T=${tables},K=${JSON.stringify(STORAGE_KEY)},d=T.DEFAULT_THEME,t=null;
var h=location.hash.match(/(?:^#|&)t=([^&]+)/);
if(h){var p=decodeURIComponent(h[1]).split(".");
if(p.length>=6&&(p[0]==="light"||p[0]==="dark")&&T.ACCENTS[p[1]]&&T.FONTS[p[2]]&&T.RADII[p[3]]&&T.DENSITIES[p[4]]&&T.MOTIONS[p[5]])
t={mode:p[0],accent:p[1],font:p[2],radius:p[3],density:p[4],motion:p[5]};}
if(!t){var s=localStorage.getItem(K);if(s)t=JSON.parse(s);}
if(!t){t=d;}
var a=T.ACCENTS[t.accent]||T.ACCENTS[d.accent],f=T.FONTS[t.font]||T.FONTS[d.font],
r=T.RADII[t.radius]||T.RADII[d.radius],y=T.DENSITIES[t.density]||T.DENSITIES[d.density],
m=T.MOTIONS[t.motion]||T.MOTIONS[d.motion],e=document.documentElement,st=e.style;
st.setProperty("--accent-h",String(a.h));st.setProperty("--accent-c",String(a.c));
st.setProperty("--font-display-active",f.display);st.setProperty("--font-body-active",f.body);
st.setProperty("--font-mono-active","var(--font-jetbrains-mono)");
st.setProperty("--radius-base",r.value);st.setProperty("--spacing",y.value);
st.setProperty("--motion",m.value);
e.dataset.mode=t.mode;e.dataset.motion=t.motion;
var mc=document.querySelector('meta[name="theme-color"]');
if(mc)mc.setAttribute("content",t.mode==="dark"?"#191716":"#fbfaf9");
st.colorScheme=t.mode;
}catch(err){}})();`;
}
