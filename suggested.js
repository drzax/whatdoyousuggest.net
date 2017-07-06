// Setup a trim function
String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,"");
}

// Array implode function
Array.prototype.implode = function(join) {
	var ret = this[0];
	for (var i=1; i<this.length; i++){
		ret += join + this[i];
	}
	return ret;
}

// Setup an object sizing function
Object.size = function(obj) {
	var size = 0, key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
};

var suggested = function($) {

	// Private vars
	var gs, r, spinner;
	var sets = {};
	var start = {x:30,y:150};
	var font_size = 18;
	var original_phrase = '';
	var permalink = [];
	var english_letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
	var english_questions = ["will", "do","has", "is","are", "how","does","when","what","why", "who"];
	var locales = {
		'default' : {
			name : 'Default',
			domain : 'www.google.com',
			lang : 'en'
		},
		au : {
			name : 'Australia',
			domain : 'www.google.com.au',
			lang : 'en'
		},
		br : {
			name : 'Brazil',
			domain : 'www.google.com.br',
			lang : 'pt'
		},
		ca : {
			name : 'Canada',
			domain : 'www.google.ca',
			lang : 'en'
		},
		us : {
			name : 'USA',
			domain : 'google.us',
			lang : 'en'
		},
		de : {
			name : 'Germany',
			domain : 'www.google.de',
			lang : 'de'
		},
		it : {
			name : 'Italy',
			domain : 'www.google.it',
			lang : 'it'
		},
		gb : {
			name : 'United Kingdom',
			domain : 'www.google.co.uk',
			lang : 'en'
		},
		es : {
			name : 'Spain',
			domain : 'google.es',
			lang : 'es'
		},
		nz : {
			name : 'New Zealand',
			domain : 'www.google.co.nz',
			lang : 'en'
		},
		jp : {
			name : 'Japan',
			domain : 'www.google.co.jp',
			lang : 'jp'
		},
		za : {
			name : 'South Africa',
			domain : 'www.google.co.za',
			lang : 'en'
		},
		ke : {
			name : 'Kenya',
			domain : 'www.google.co.ke',
			lang : 'en'
		},
		fr : {
			name : 'France',
			domain : 'www.google.fr',
			lang : 'fr'
		}
	}

	var seeds = {
		en : {
			words : ["a","able","about","account","acid","across","act","addition","adjustment","advertisement","after","again","against","agreement","air","all","almost","among","amount","amusement","and","angle","angry","animal","answer","ant","any","apparatus","apple","approval","arch","argument","arm","army","art","as","at","attack","attempt","attention","attraction","authority","automatic","awake","baby","back","bad","bag","balance","ball","band","base","basin","basket","bath","be","beautiful","because","bed","bee","before","behaviour","belief","bell","bent","berry","between","bird","birth","bit","bite","bitter","black","blade","blood","blow","blue","board","boat","body","boiling","bone","book","boot","bottle","box","boy","brain","brake","branch","brass","bread","breath","brick","bridge","bright","broken","brother","brown","brush","bucket","building","bulb","burn","burst","business","but","butter","button","by","cake","camera","canvas","card","care","carriage","cart","cat","cause","certain","chain","chalk","chance","change","cheap","cheese","chemical","chest","chief","chin","church","circle","clean","clear","clock","cloth","cloud","coal","coat","cold","collar","colour","comb","come","comfort","committee","common","company","comparison","competition","complete","complex","condition","connection","conscious","control","cook","copper","copy","cord","cork","cotton","cough","country","cover","cow","crack","credit","crime","cruel","crush","cry","cup","cup","current","curtain","curve","cushion","damage","danger","dark","daughter","day","dead","dear","death","debt","decision","deep","degree","delicate","dependent","design","desire","destruction","detail","development","different","digestion","direction","dirty","discovery","discussion","disease","disgust","distance","distribution","division","do","dog","door","doubt","down","drain","drawer","dress","drink","driving","drop","dry","dust","ear","early","earth","east","edge","education","effect","egg","elastic","electric","end","engine","enough","equal","error","even","event","ever","every","example","exchange","existence","expansion","experience","expert","eye","face","fact","fall","false","family","far","farm","fat","father","fear","feather","feeble","feeling","female","fertile","fiction","field","fight","finger","fire","first","fish","fixed","flag","flame","flat","flight","floor","flower","fly","fold","food","foolish","foot","for","force","fork","form","forward","fowl","frame","free","frequent","friend","from","front","fruit","full","future","garden","general","get","girl","give","glass","glove","go","goat","gold","good","government","grain","grass","great","green","grey","grip","group","growth","guide","gun","hair","hammer","hand","hanging","happy","harbour","hard","harmony","hat","hate","have","he","head","healthy","hear","hearing","heart","heat","help","high","history","hole","hollow","hook","hope","horn","horse","hospital","hour","house","how","humour","I","ice","idea","if","ill","important","impulse","in","increase","industry","ink","insect","instrument","insurance","interest","invention","iron","island","jelly","jewel","join","journey","judge","jump","keep","kettle","key","kick","kind","kiss","knee","knife","knot","knowledge","land","language","last","late","laugh","law","lead","leaf","learning","leather","left","leg","let","letter","level","library","lift","light","like","limit","line","linen","lip","liquid","list","little","living","lock","long","look","loose","loss","loud","love","low","machine","make","male","man","manager","map","mark","market","married","mass","match","material","may","meal","measure","meat","medical","meeting","memory","metal","middle","military","milk","mind","mine","minute","mist","mixed","money","monkey","month","moon","morning","mother","motion","mountain","mouth","move","much","muscle","music","nail","name","narrow","nation","natural","near","necessary","neck","need","needle","nerve","net","new","news","night","no","noise","normal","north","nose","not","note","now","number","nut","observation","of","off","offer","office","oil","old","on","only","open","operation","opinion","opposite","or","orange","order","organization","ornament","other","out","oven","over","owner","page","pain","paint","paper","parallel","parcel","part","past","paste","payment","peace","pen","pencil","person","physical","picture","pig","pin","pipe","place","plane","plant","plate","play","please","pleasure","plough","pocket","point","poison","polish","political","poor","porter","position","possible","pot","potato","powder","power","present","price","print","prison","private","probable","process","produce","profit","property","prose","protest","public","pull","pump","punishment","purpose","push","put","quality","question","quick","quiet","quite","rail","rain","range","rat","rate","ray","reaction","reading","ready","reason","receipt","record","red","regret","regular","relation","religion","representative","request","respect","responsible","rest","reward","rhythm","rice","right","ring","river","road","rod","roll","roof","room","root","rough","round","rub","rule","run","sad","safe","sail","salt","same","sand","say","scale","school","science","scissors","screw","sea","seat","second","secret","secretary","see","seed","seem","selection","self","send","sense","separate","serious","servant","sex","shade","shake","shame","sharp","sheep","shelf","ship","shirt","shock","shoe","short","shut","side","sign","silk","silver","simple","sister","size","skin","","skirt","sky","sleep","slip","slope","slow","small","smash","smell","smile","smoke","smooth","snake","sneeze","snow","so","soap","society","sock","soft","solid","some","","son","song","sort","sound","soup","south","space","spade","special","sponge","spoon","spring","square","stage","stamp","star","start","statement","station","steam","steel","stem","step","stick","sticky","stiff","still","stitch","stocking","stomach","stone","stop","store","story","straight","strange","street","stretch","strong","structure","substance","such","sudden","sugar","suggestion","summer","sun","support","surprise","sweet","swim","system","table","tail","take","talk","tall","taste","tax","teaching","tendency","test","than","that","the","then","theory","there","thick","thin","thing","this","thought","thread","throat","through","through","thumb","thunder","ticket","tight","till","time","tin","tired","to","toe","together","tomorrow","tongue","tooth","top","touch","town","trade","train","transport","tray","tree","trick","trouble","trousers","true","turn","twist","umbrella","under","unit","up","use","value","verse","very","vessel","view","violent","voice","waiting","walk","wall","war","warm","wash","waste","watch","water","wave","wax","way","weather","week","weight","well","west","wet","wheel","when","where","while","whip","whistle","white","who","why","wide","will","wind","window","wine","wing","winter","wire","wise","with","woman","wood","wool","word","work","worm","wound","writing","wrong","year","yellow","yes","yesterday","you","young"],
			letters : english_letters,
			questions : english_questions
		},
		de : {
			letters : ["a","ä","b","c","d","e","f","g","h","i","j","k","l","m","n","o","ö","p","q","r","s","t","u","ü","v","w","x","y","z"],
			words : ["der","die","das","sein","in","ein","zu","haben","ich","werden","sie","von","nicht","mit","es","sich","auch","auf","für","an","er","so","dass","können","dies","als","ihr","ja","wie","bei","oder","wir","aber","man","da","sein","noch","nach","was","also","aus","all","wenn","nur","müssen","sagen","um","über","machen","kein","Jahr das","du","mein","schon","vor","durch","geben","mehr","andere","viel","kommen","jetzt","sollen","mir","wollen","ganz","mich","immer","gehen",'sehr','hier','doch','bis','groß','wieder','Mal das','zwei','gut','wissen','neu','sehen','lassen','uns','weil','unter','denn','stehen','jede','Beispiel','Zeit','erste','ihm','ihn','wo','lang','eigentlich','damit','selbst','unser','oben']
		},
		jp : {
			words : ["亜","哀","握","扱","依","偉","威","尉","慰","為","維","緯","違","井","壱","逸","稲","芋","姻","陰","隠","閑","陥","含","頑","企","鑑","緩","缶","肝","艦","貫","還","滑","褐","轄","且","刈","乾","冠","勘","勧","喚","堪","寛","患","憾","換","敢","棺","款","歓","汗","環","甘","監","戒","拐","皆","劾","慨","概","涯","該","垣","嚇","核","殻","獲","穫","較","郭","隔","岳","掛","潟","喝","括","渇","怪","悔","懐","壊","塊","韻","渦","浦","影","詠","鋭","疫","悦","謁","越","閲","宴","援","炎","煙","猿"]
		}

	};

	// Constants
	var node_margin = 20;
	var level_spacing = 160;
	var control_pt = level_spacing*0.3;
	var canvas_padding = 800;

	// Private methods

	var get = {
		path : function (decode) {
			if (decode == undefined) {
				decode = true;
			}
			var plain = parent.location.hash.replace("#", '').split('|')[0];
			if (!decode) {
				return plain;
			}
			return punycode.decode(plain);
		},
		locale : function () {
			return parent.location.hash.replace("#", '').split('|')[1];
		},
		locale_compare : function () {
			return parent.location.hash.replace("#", '').split('|')[2];
		}
	}

	var set = {
		path : function(path) {
			var components = parent.location.hash.replace("#", '').split('|');
			components[0] = punycode.encode(path);
			parent.location.hash = components.implode('|');
		},
		locale : function(locale) {
			var components = parent.location.hash.replace("#", '').split('|');
			components[1] = locale;
			parent.location.hash = components.implode('|');

			$('#primary-locale>span').text(locales[locale].name);
			$('#primary-locale li').removeClass('set');
			$('#' + locale + '-primary').addClass('set');
		},
		locale_compare : function(locale) {
			var components = parent.location.hash.replace("#", '').split('|');
			components[2] = locale;
			parent.location.hash = components.implode('|');

			$('#secondary-locale>span').text(locales[locale].name);
			$('#secondary-locale li').removeClass('set');
			$('#' + locale + '-secondary').addClass('set');
		}
	}

	var cookie = {
		create : function(name,value,days){
			if (days) {
				var date = new Date();
				date.setTime(date.getTime()+(days*24*60*60*1000));
				var expires = "; expires="+date.toGMTString();
			}
			else var expires = "";
			document.cookie = name+"="+value+expires+"; path=/";
		},
		read : function(name) {
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for(var i=0;i < ca.length;i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1,c.length);
				if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
			}
			return null;
		},
		erase : function(name) {
			cookie.create(name,"",-1);
		}
	};

	var draw = function(phrase, start, level) {

		sets.level[level] = r.set();

		spinner = r.image('spinner.gif', start.x + 20, start.y - 8, 16, 16);

		if (permalink.length == 0){
			var new_path = original_phrase;
			var remainder = phrase.replace(original_phrase, '');
			if (remainder.length != 0) {
				new_path += ','+remainder.trim().replace(/\s+/g, ',');
			}
			set.path(new_path);
		}

		$('#phrase').html(phrase);
		document.title = phrase + ' :: What do you suggest?';
		
		var suggest_callback = function (data, compare) {
			
			if (data[1].length == 0) {
				search(phrase.trim());

				// Scroll to make search term centeredish
				$('body,html').animate({scrollLeft: Math.max(0, $('#canvas').offset().left + start.x - $(window).width()*0.9)}, 1000);

				return
			}

			spinner.remove();

			// Get rid of search results completely
			$('#search-results').slideUp(300);

			// Adjust canvas width appropriately
			r.setSize(start.x + level_spacing*2 + canvas_padding, r.height);

			// Scroll to make things visible

			// BUG: r.width is reported as 1000 in IE regarless.
			$('body,html').animate({scrollLeft: Math.max(0, $('#canvas').offset().left + start.x + font_size/1.5*3 + level_spacing * 2 - $(window).width()*0.9)}, 1000);

			data = data[1];
			if (compare) {
				compare = compare[1];

				for (var i=0; i < compare.length; i++) {
					compare[i][4] = 'secondary';
					data[data.length] = compare[i];
				}
			}

			var next = [];
			var words = {};
			var max = 0;
			var min = 0;

			// Organise the data
			for (var i = 0, ii = data.length, j = 0; i < ii; i++) {

				// Replace the original phrase (and anything before it)
				var response = data[i][0].substr(data[i][0].indexOf(phrase)+phrase.length);

				var split = response.split(" ");

				// Find the next word (or final portion of beginning word) if there is one.
				var word = '';
				if (split[0] == '') {
					if (split[1] == undefined) {
						continue;
					}
					word = ' ' + split[1];
				} else {
					word = split[0];
				}
				
				// Find the results count for this suggestion.
				var count = data[i][1].replace(' results', '').replace(/,/gi, '');

				// Check if this word has been suggested already.
				if (words[word] == undefined) {
					words[word] = j;
					next[j] = {word:word, count: Number(count), locale : (data[i][4]) ? 'secondary' : 'primary'};

					if (min == 0) {min=count;}
					max = Math.max(max, count);
					min = Math.min(min, count);

					j++;
				} else { // Has been suggested before.

					var old_count = next[words[word]].count;

					next[words[word]].word = word
					next[words[word]].count += Number(count);
					if (data[i][4] && next[words[word]].locale != data[i][4]) {
						next[words[word]].locale =  'both';
					}

					if (min == 0 || min == old_count) {min = next[words[word]].count;}
					max = Math.max(max, next[words[word]].count);

				}
			}



			// Variables
			var end = {x: start.x + level_spacing, y: Math.max(node_margin, start.y - (Object.size(next)-1)*node_margin)};

			i = 0;
			var draw_path = function() {
				// Stop if there's nowhere to go.
				if (next[i] == undefined) {
					return;
				}

				// Normalize the result numbers
				var factor = (next[i].count - min)/(max-min);
				var line_weight = 9*factor+1;

				var p = r.path("M"+start.x+','+start.y+"L"+start.x+','+start.y);
				sets.all.push(p);
				sets.level[level].push(p);




				var path_string =  "M"+start.x+','+start.y+'C'+(start.x+control_pt)+','+(start.y)+','+(end.x-control_pt)+','+end.y+','+end.x+','+end.y;
				var this_word = next[i].word;

				var attach_word = function() {


					var word = r.text(0, 0, next[i].word.toUpperCase())
						.attr({
							'font-size':font_size,
							'fill': (next[i].locale == 'both') ? '#fff' : '#222',
							x: end.x+font_size/1.5,
							y: end.y,
							"text-anchor": "start"
						});

					// Resize stupidly long words.
					var this_font_size = font_size;
					while (word.getBBox().width > level_spacing) {
						this_font_size--;
						word.attr({'font-size': this_font_size} );
					}

					// Run the getBBox function just once so we can use the values later.
					var wordBBox = word.getBBox();
					var c = r.rect(
						wordBBox.x-font_size/1.5,
						wordBBox.y-font_size/3,
						wordBBox.width+font_size/1.5*2,
						wordBBox.height+font_size/3*2,
						font_size/2);

					word.toFront();

					// Add new elements to some sets for selection later.
					sets.all.push(c, word, count);
					sets.level[level].push(c, word, count);

					var box_colour = '';

					switch (next[i].locale) {
						case 'both' :
							box_colour = '#888';
							break;
						case 'primary' :
							box_colour = '#cceeff';
							break;
						default :
							box_colour = '#ffdddd';
					}

					c.attr({fill: box_colour, "stroke":"none", "stroke-width": font_size/6});
					word.hover(function() {
						this.animate({stroke: '#222', "stroke-width":font_size/8}, "bounce", 200);
					},function(){
						this.animate({"stroke-width": 0}, 200);
					});

					$(word.node).hover(function(){
						$(this).css('cursor','pointer');
					})

					// Give the words their click listeners
					word.click(clicked);

					// Adjust the canvas height appropriately
					if (wordBBox.y+50 > r.height) { // Make the canvas taller.
						r.setSize(r.width, wordBBox.y+50);
					}

					// Load permalink if there's anything left
					if (permalink.length == 1) { // Clears permalink if there was only one level (because it will already have been loaded.
						permalink = [];
					}
					if (permalink[level+1] != undefined && permalink[level+1].toLowerCase().trim() == this_word.toLowerCase().trim()) {

						draw(phrase+this_word+' ', {x:word.getBBox().x+word.getBBox().width+font_size/1.5, y:word.getBBox().y+word.getBBox().height/2}, level+1);
						
						// We're at the end of permalink levels so clear it out and record that we've loaded it.
						if (level == permalink.length - 2) {
							permalink=[];

							// Add some tracking
							if (pageTracker) {
								pageTracker._trackEvent('Load Permalink', phrase + this_word, unescape(parent.location.href));
							}
						}
					}

					// Setup for next run
					end.y += node_margin*2;
					i++;

					// Run it again
					draw_path();
				}; // Attach word

				p.attr({stroke:'#666'});
				p.animate({path:path_string, "stroke-width": line_weight, 'stroke':'#666'}, 80, '<>', attach_word);

				var clicked = function() {

					fix_header();

					var i = level+1;
					while (sets.level[i] != undefined){
						sets.level[i].remove();
						i++;
					}

					if (pageTracker) {
						pageTracker._trackEvent('Explore', this_word, phrase+this_word);
					}

					draw(phrase+this_word+' ', {x:this.getBBox().x+this.getBBox().width+font_size/1.5, y:this.getBBox().y+this.getBBox().height/2}, level+1);
				}; 
			}

			draw_path();

		} // $.getJSON callback
		
		var params = {
			url: "proxy.php?url=" + encodeURIComponent("http://" + locales[get.locale()].domain + "/complete/search?output=toolbar&q=" + phrase),
			success: function (data) {
				if ( get.locale_compare() != 'default' ) {
					params.url = "proxy.php?url=" + encodeURIComponent("http://" + locales[get.locale_compare()].domain + "/complete/search?output=toolbar&q=" + phrase);
					params.success = function (data2) {
						suggest_callback(data, data2);
					};
					$.ajax(params);
				} else {
					suggest_callback(data);
				}
			},
			error: function(a,b) {
				console.log(a,b);
			},
			dataType: 'xml'
		};
		
		$.ajax(params);


	}; // draw

	var fix_header = function() {
		$('header').css({'position':'fixed', 'left':'0'});
	}

	
	var search = function (phrase) {

		// Setup the UI
		$('#search-results .result').slideUp(300, function(){
			$(this).remove();
		});

		var $results = $('#search-results').slideDown(300);

		gs = null;
		gs = new google.search.WebSearch();
		gs.setRestriction(google.search.Search.RESTRICT_EXTENDED_ARGS, {gl: get.locale()});
		gs.setSearchCompleteCallback(this, function(){

			var articles_html = '';
			
			for (var i=0, ii=gs.results.length; i<ii; i++) {
				articles_html += '<div class="result"><a href="'+gs.results[i].url+'" class="title">'+gs.results[i].title+'</a><span class="url"> ' + gs.results[i].visibleUrl + '</span></div>';
			}

			spinner.remove();
			$(articles_html).hide().appendTo($results).slideDown(300, function() {
				if ($('header').height() > $(window).height()) {
					$('header').css({
						'position': 'absolute',
						'left' : $('header').offset().left,
						'top' : $('header').offset().top
					}).animate({'top': 0});
				}
			});

			$('.result a').click(function(){
				// Add some tracking
				if (pageTracker) {
					pageTracker._trackEvent('Exit', 'Search Result Clicked', $(this).attr("href"));
				}
			});

		});
		
		gs.execute(phrase);

		// Add some tracking
		if (pageTracker) {
			pageTracker._trackEvent('Search', phrase);
		}
		
	}; // search

	var seed = function(phrase) {
		// If there's no seed, don't bother
		if (phrase.trim().length == 0) return;

		// Tidy a few UI things up
		permalink = [];
		fix_header();
		close_help();
		$('#twitter-cta, footer, #share, #home-link').fadeIn(2000);
		sets.all.remove();
		r.setSize(500,500);
		$('header h1').slideUp();

		// Start drawing
		original_phrase = phrase;
		var start_phrase = r.text(0, 0, original_phrase.toUpperCase())
			.attr({
				'font-size':font_size,
				'fill':'#ddd',
				x: start.x+font_size,
				y: start.y,
				"text-anchor": "start"
			});
		var origin = r.rect(
			start_phrase.getBBox().x-font_size,
			start_phrase.getBBox().y-font_size/3,
			start_phrase.getBBox().width+font_size*2,
			start_phrase.getBBox().height+font_size/3*2,
			font_size/2
		).attr({
				fill: '#666',
				"stroke":"#000",
				"stroke-width": 0
		});
		start_phrase.toFront();

		// Add it to a set
		sets.all.push(origin, start_phrase);

		draw(original_phrase, {x: origin.getBBox().x+origin.getBBox().width, y: origin.getBBox().y+origin.getBBox().height/2}, 0);
	}


	// Constructor code
	sets.level = [];

	
	
	r = Raphael('canvas', 500, 500);
	sets.all = r.set();

	$('#form').submit(function(){
		
		var seed_phrase = $('#start').val();

		seed(seed_phrase);
		
		// Add some tracking
		if (pageTracker) {
			pageTracker._trackEvent('Seed', "Manual", seed_phrase);
		}
		
		return false;
	});

	// Setup random word
	$('#word').click(function(){

		// Get the words list for the relevant language - if available (fallback to english).
		
		var words = (seeds[locales[get.locale()].lang] == undefined || seeds[locales[get.locale()].lang].words == undefined) ? seeds['en'].words : seeds[locales[get.locale()].lang].words;
		var seed_phrase = words[Math.floor(Math.random() * (words.length))] + " ";
		$('#start').val(seed_phrase);
		seed(seed_phrase);

		// Add some tracking
		if (pageTracker) {
			pageTracker._trackEvent('Seed', "Random Word", seed_phrase);
		}
		return false;
	});
	$('#letter').click(function(){
		var letters = (seeds[locales[get.locale()].lang] == undefined || seeds[locales[get.locale()].lang].letters == undefined) ? seeds['en'].letters : seeds[locales[get.locale()].lang].letters;
		var seed_phrase = letters[Math.floor(Math.random() * (letters.length))];
		$('#start').val(seed_phrase);
		seed(seed_phrase);

		// Add some tracking
		if (pageTracker) {
			pageTracker._trackEvent('Seed', "Random Letter", seed_phrase);
		}
		return false;
	});
	$('#question').click(function(){
		var seed_phrase = english_questions[Math.floor(Math.random() * (english_questions.length))] + " " + english_letters[Math.floor(Math.random() * (english_letters.length))];
		$('#start').val(seed_phrase);
		seed(seed_phrase);
		// Add some tracking
		if (pageTracker) {
			pageTracker._trackEvent('Seed', "Random Question", seed_phrase);
		}
		return false;
	});

	$('.track').click(function(){
		var $this = $(this);
		if (pageTracker) {
			pageTracker._trackEvent('Exit', $this.attr("title"), $this.attr("href"));
		}
	});

	$('#help-open').click(function(){
		var $help = $('#help');
		$('#help-close').remove();
		$help.css({'position': 'fixed', 'right': 5, 'top': 5, 'left': 'auto'});
		$help
			.append($('<a href="#close" id="help-close" title="Close help">X</a>').click(close_help))
			.fadeIn(500, function(){
				if ($help.outerHeight() > $(window).height()) {
					$help.css({'position': 'absolute', 'left': $help.offset().left, 'top': $help.offset().top, 'right': 'auto'});
				}
			});
		return false;
	});

	$('#star-it').click(function(){
		$.getJSON('/ajax.php', {action: 'star', permalink: unescape(parent.location.hash)}, function(data, status) {
			if (data.result == 'success') {
				$notify = $('<div id="notify">Starred</div>');
				$notify.css({
					position: 'fixed',
					top: '50px',
					right: '50px',
					'text-align': 'center',
					width: '200px',
					color: '#fff',
					background: '#000',
					padding: '40px',
					"border-radius": '20px'
				}).hide().appendTo('body').show().fadeOut(function(){$(this).remove();});
			}
		});
		return false;
	});

	$('.select').hover(function(){$('ol', this).show(); $(this).addClass('hover')}, function(){$('ol', this).hide(); $(this).removeClass('hover')})

	$('.select ol li').click(function(){
		// Figure out the country and the dropdown IDs
		var ids = this.id.split('-');
		var new_locale = ids[0];
		var locale_function = (ids[1] == 'primary') ? 'locale' : 'locale_compare';

		if ( new_locale != get[locale_function]() ) {
			set[locale_function](new_locale);
			load_permalink();
			$('.select ol').hide();

			// Record the new comparison
			if (pageTracker) {
				pageTracker._trackEvent('Compare', locales[get.locale()].name + ' - ' + locales[get.locale_compare()].name, get.path(true));
			}
		}
		
	});

	var close_help = function() {
		$('#help').fadeOut(600, function() {
			$('#help').css({'position': 'fixed', 'right': 5, 'top': 5, 'left': 'auto'});
		});
		return false;
	};
	

	$('#tweet-this').click(function(){
		$.getJSON('http://json-tinyurl.appspot.com/?url='+escape(parent.location.href)+'&callback=?', function (data){
			parent.location = 'http://twitter.com/home?status=' + escape($('#phrase').text() + ' ' + data.tinyurl + ' #wdys');
		});
		if (pageTracker) {
			pageTracker._trackEvent('Exit', "Tweet this", $('#phrase').text());
		}
		return false;
	});

	$(window).scroll(function(){
		if ($('header').css('position') == 'absolute') {
			$('header').stop().animate({'left': $(window).scrollLeft()});
		}
		var $help = $('#help');
		if ($help.css('position') == 'absolute') {
			if ($help.offset().top > $(window).scrollTop()) {
				$help.queue(function(next){
					$help.stop().animate({'left': $(window).scrollLeft()+$(window).width() - $help.outerWidth() - 5, 'top': $(window).scrollTop()+5});
					next();
				});
			} else {
				$help.queue(function(next){
					$help.stop().animate({'left': $(window).scrollLeft()+$(window).width() - $help.outerWidth() - 5});
					next();
				});
			}
		}
	});

	// Check for a selected locale

	if (!get.locale()) {
		set.locale('default');
		// Also encode the path because chances are we're loading an old link
		set.path(get.path(false));
	} else {
		set.locale(get.locale());
	}

	if (!get.locale_compare()) {
		set.locale_compare('default');
	} else {
		set.locale_compare(get.locale_compare());
	}

	var load_permalink = function() {
		permalink = get.path().split(',');
		if (permalink[0].length == 0) {
			permalink = [];
			return;
		}
		$('#start').val(unescape(permalink[0]));
		seed(unescape(permalink[0]));
	}

	// Are we loading a permalink?
	if (get.path().length > 0) {
		load_permalink();
	} else if (!cookie.read('returning')) {
		$('#help-open').click();
	}

	cookie.create('returning', 'true', 365);

	$('#start').focus();

	return {

		// Public vars



		// Public methods
		
	}
};