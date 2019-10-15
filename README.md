# collapsible-Nav
Javascript and CSS library to easily make a collapsible nav.

_Might require bootstrap in your project._

## Extremely light weight and adaptable Markup

```  
  <div class="your-classname-here">                    // optionally pass the .navbar-noflex to override the default flex-blox

    // Markup for the logo
    <a href="..." class="site-logo">                   // don't forget the .site-logo class
      <img, whatever you want
    </a>

    // markup for the nav
    <ul>
      <li> link </li>
      <li> link </li>
      <li class="sticky sticky-collapse"> link </li>   // will not collapse until all other elements have collapsed
      <li class="sticky"> link </li>                   // will never collapse unless it absolutely will not fit
    </ul>
  </div>
  ```
  
