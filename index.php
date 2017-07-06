<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>What do you suggest?</title>

		<link type="text/css" rel="stylesheet" media="all" href="all.css"/>
		<!--[if lte IE 8]>
		<link type="text/css" rel="stylesheet" media="all" href="ie.css"/>
		<![endif]-->


		<script src="http://www.google.com/jsapi"></script>
		<script src="raphael.js"></script>
		<script src="punycode.js"></script>
		<script src="suggested.js"></script>
		<script>
			//<![CDATA[
			// Load some library files
			google.load("jquery", "1.4");
			google.load("jqueryui", "1.8.1");
			google.load("search", '1.0');

			google.setOnLoadCallback(function() {
				var s = new suggested(jQuery);
			});
			//]]>
		</script>


		<!--[if IE]>
		<script>
			/* Make IE behave properly with HTML5 markup. */
			document.createElement("header");
			document.createElement("footer");
			document.createElement("nav");
			document.createElement("article");
			document.createElement("section");
		</script>
		<![endif]-->

	</head>
	<body>
		<nav>
			<a href="#help" title="Open Help" id="help-open">?</a>
			<a href="#star" title="Star" id="star-it">&#x2605;</a>
			<a href="/" title="Home" id="home-link">&#x2302;</a>
			
		</nav>
		<header>
			<div id="inputs">
				<h1><a href="/" title="Start again">Start Here</a><span class="arrow">&#8595;</span></h1>
				<form id="form" action="">
					<input type="text" id="start" />
				</form>
				<h2>Or try</h2>
				<a class="random-link" href="#" id="word" title="Random word">word</a>
				<a class="random-link" href="#" id="letter" title="Random letter">letter</a>
				<a class="random-link" href="#" id="question" title="Random question start">question</a>
			</div>
			<p id="twitter-cta">You should <a class="track" href="http://twitter.com/drzax" id="twitter-link" title="Follow me on Twitter">follow me on Twitter</a></p>
			<section id="search-results"></section>
		</header>

		<!-- This is where the magic happens. -->
		<div id="canvas"></div>
		
		
		<div id="options">
			<div>
				<h3>Options:</h3> View suggestions from
				<div id="primary-locale" class="select">
					<span>Default</span> &nbsp; &#9660;
					<ol>
						<li id="default-primary">Default</li>
						<li id="au-primary">Australia</li>
						<li id="br-primary">Brazil</li>
						<li id="ca-primary">Canada</li>
						<li id="fr-primary">France</li>
						<li id="de-primary">Germany</li>
						<li id="it-primary">Italy</li>
						<li id="jp-primary">Japan</li>
						<li id="ke-primary">Kenya</li>
						<li id="nz-primary">New Zealand</li>
						<li id="za-primary">South Africa</li>
						<li id="es-primary">Spain</li>
						<li id="gb-primary">United Kingdom</li>
						<li id="us-primary">United States of America</li>
					</ol>
				</div> and compare them to
				<div id="secondary-locale" class="select">
					<span>Default</span> &nbsp; &#9660;
					<ol>
						<li id="default-secondary">Default</li>
						<li id="au-secondary">Australia</li>
						<li id="br-secondary">Brazil</li>
						<li id="ca-secondary">Canada</li>
						<li id="fr-secondary">France</li>
						<li id="de-secondary">Germany</li>
						<li id="it-secondary">Italy</li>
						<li id="jp-secondary">Japan</li>
						<li id="ke-secondary">Kenya</li>
						<li id="nz-secondary">New Zealand</li>
						<li id="za-secondary">South Africa</li>
						<li id="es-secondary">Spain</li>
						<li id="gb-secondary">United Kingdom</li>
						<li id="us-secondary">United States of America</li>
					</ol>
				</div>
			</div>
			<div id="share"><h3>Phrase:</h3> <span id="phrase">???</span> <a class="track" id="tweet-this" href="http://twitter.com/home?status=http://whatdoyousuggest.net" title="Tweet this">Tweet This</a></div>
		</div>
		


		<section id="help">
			<h2>Hello.</h2>
			<p><em>What Do You Suggest</em> takes a seed from you (or gives you something random) then guides you on a journey through language and the collective lives of Google users.</p>
			<p>Using <a href="http://labs.google.com/intl/en/suggestfaq.html" class="track" title="Google Suggest">data from Google</a> to make suggetions on where you might like to go next, <em>What Do You Suggest</em> is an experimental and interactive environment designed to explore how we use language and search on the internet.</p>
			<p>You can read <a class="track" title="The Power of Suggestion at sw'as" href="http://elvery.net/drzax/tag/wdys">more about the site on my blog</a>. As part of this experiment, I'm recording some data about how people use the site and the paths they choose to explore. If you're interested in seeing what I find, subscribe to <a href="http://elvery.net/drzax/atom/1" title="RSS feed at sw'as" class="track">the RSS feed</a> on <a href="http://elvery.net/drzax" title="sw'as" class="track">sw'as</a> or <a href="http://twitter.com/drzax" title="Follow me on Twitter" class="track">follow me on Twitter</a></p>
			<p>Other than that, feel free to just play around and see what you find and please <a href="http://elvery.net/drzax/contact-author" title="Contact" class="track">get in touch</a> if you have any comments.</p>
			<h3>A couple of things:</h3>
			<ul>
				<li>The words that appear <strong>first in each set</strong> of options are the words Google thinks are most likely to be <strong>what people are looking for</strong>.</li>
				<li>The words joined by the <strong>thickest lines</strong> are ones which will produce the <strong>most results</strong> if you searched for them on Google.</li>
			</ul>
			<p><strong>Key:</strong> <span style="background: #cceeff;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> primary locale only - <span style="background: #ffdddd;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> secondary locale only - <span style="background: #888;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> both.</p>
			<p class="credit">This was inspired by <a class="track" href="http://hint.fm/projects/seer/">Web Seer</a> and <a class="track" href="http://hint.fm/projects/wordtree/">Word Tree</a>.</p>
		</section>

		<footer>
			<p>By <a class="track" href="http://elvery.net/drzax" title="Visit sw'as">Simon Elvery</a> - &copy; 2010 </p>
		</footer>


		<!-- A few scripts to take care of analytics etc. -->
		<script type="text/javascript">
			var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
			document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
		</script>
		<script type="text/javascript">
			try {
				var pageTracker = _gat._getTracker("UA-55411-8");
				pageTracker._trackPageview();
			} catch(err) {}
		</script>
	</body>
</html>
