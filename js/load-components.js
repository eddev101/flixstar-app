function loadComponents() {
    const user = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
    const loginLink = user 
        ? `<a class="dropdown-item" href="../user/logout.html">Logout</a>` 
        : `<a class="dropdown-item" href="../user/login.html">Login</a>`;
    const signupLink = user ? '' : `<a class="dropdown-item" href="../user/register.html">Sign Up</a>`;

    // Inject navbar
    const navbarHTML = `
        <div class="main-header">
      <nav class="navbar navbar-expand-lg navbar-light">
        <div class="container-fluid res-container">
          <a href="../index.html" class="navbar-brand" style="top: -10px;position: relative;">
            <img src="../images/logo3.png" class="img-fluid logo" alt="" style="width: 100px;">
          </a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" style="border: none;">
            <span class="navbar-toggler-icon" style="background: url('../images/menu.png') no-repeat scroll center center;"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <form class="form-inline my-2 my-lg-0 mobile-form" action="#" method="GET" onsubmit="handleSearch(event)">
              <input class="form-control mr-sm-2" type="search" placeholder="Search for Movies, People and Tv Shows" aria-label="Search" name="query" required>
            </form>
            <ul class="navbar-nav mr-auto">
              <li class="nav-item"><a class="nav-link" href="../index.html">Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="../movie/movie-list.html">Movies</a></li>
                    <li class="nav-item"><a class="nav-link" href="../tvshow/tvshow-list.html">Tv Shows</a></li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" id="moreDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            More
                        </a>
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="moreDropdown">
                            <a class="dropdown-item" href="../genres/genres.html">Genres</a>
                            <a class="dropdown-item" href="../collections/collections.html">Collections</a>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="../person/people-list.html">People</a>
                            <a class="dropdown-item" href="../videos/videos.html">Videos</a>
                            <div class="dropdown-divider"></div>
                            <a class="dropdown-item" href="../movie/top-movie-list.html">Top Movies</a>
                            <a class="dropdown-item" href="../tvshow/top-tvshow-list.html">Top Series</a>
                        </div>
                    </li>
                </ul>

            <form class="form-inline my-2 my-lg-0 abv-mobile-form" action="#" method="GET" onsubmit="handleSearch(event)">
              <input class="form-control mr-sm-2" type="search" placeholder="Search for Movies, People and Tv Shows" aria-label="Search" name="query" required>
            </form>

            
            <ul class="navbar-nav ml-auto">
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    ${user ? 'User' : 'Guest'}
                </a>
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="userDropdown">
                  ${loginLink}
                  ${signupLink}
                  ${user ? '<a class="dropdown-item" href="../user/favorites.html">Favorites</a>' : ''}
                  ${user ? '<a class="dropdown-item" href="../user/watchlist.html">Watchlist</a>' : ''}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
    `;
    document.getElementById('main-header').innerHTML = navbarHTML;

    // Inject footer (unchanged example)
    const footerHTML = `
        <footer class="iq-bg-dark">
  <div class="footer-top">
    <div class="container-fluid">
      <div class="row footer-standard">
        <div class="col-lg-5">
          <div class="widget text-left">
            <div>
              <ul class="menu p-0">
                <li><a href="#">Terms of Use</a></li>
                <li><a href="#">Privacy-Policy</a></li>
                <li><a href="#">FAQ</a></li>
              </ul>
            </div>
          </div>
          <div class="widget text-left">
            <div class="textwidget">
              <p><small>Flixstar is a Free Movies streaming and downloading site with zero ads. We let you watch and download movies online without having to pay, with over 10000 movies and TV Shows. We require users to register so as you can save Movies and Tv Shows In Your List and watch them later as you may prefer.</small></p>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6 mt-4 mt-lg-0">
          <h6 class="footer-link-title">Share</h6>
          <ul class="info-share">
            <li>
              <a href="http://www.facebook.com/sharer.php?u=#">
                <i class="fa-brands fa-facebook"></i>
              </a>
            </li>
            <li>
              <a href="http://reddit.com/submit?url=#" target="_blank">
                <i class="fa-brands fa-reddit"></i>
              </a>
            </li>
            <li>
              <a href="https://x.com/share?url=#&text=Simple%20Share%20Buttons&hashtags=simplesharebuttons" target="_blank">
                <i class="fa-brands fa-twitter"></i>
              </a>
            </li>
            <li>
              <a href="whatsapp://send?text=#" data-action="share/whatsapp/share">
                <i class="fa-brands fa-whatsapp"></i>
              </a>
            </li>
          </ul>
        </div>
        <div class="col-lg-3 col-md-6 mt-4 mt-lg-0">
          <div class="widget text-left">
            <div class="textwidget">
              <h6 class="footer-link-title">Flixstar</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</footer>
    `;
    document.querySelector('footer.iq-bg-dark').innerHTML = footerHTML;
}

document.addEventListener('DOMContentLoaded', loadComponents);