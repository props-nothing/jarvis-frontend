import { mount } from "../main";
import Home from "../pages/Home";
import { legacyDestination } from "../site";

function redirectLegacyAnchor() {
  const destination = legacyDestination(window.location.hash);
  if (!destination) return false;
  const url = new URL(destination, window.location.origin);
  url.search = window.location.search;
  window.location.replace(url);
  return true;
}

window.addEventListener("hashchange", redirectLegacyAnchor);
if (!redirectLegacyAnchor()) mount("home", <Home />);
