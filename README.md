# collapsibleNavJs
Javascript and CSS library to easily make a collapsible nav.

_Might require bootstrap in your project._
_Adapted from https://codepen.io/timgomm/_

## Extremely light weight and adaptable Markup

```  
  // single wrapper for everything
  <div class="your-classname-here">                 // optionally pass .navbar-noflex to override flex-blox

    // Markup for the logo
    <a href="…" class="site-logo">                  // don't forget the .site-logo class
      <img, whatever you want … />
    </a>

    // markup for the nav
    <ul>
      <li> … </li>
      <li> … </li>
      <li class="sticky sticky-collapse"> … </li>   // will not collapse until all other elements have collapsed
      <li class="sticky"> … </li>                   // will never collapse unless it absolutely will not fit
    </ul>
  </div>
  ```
  
