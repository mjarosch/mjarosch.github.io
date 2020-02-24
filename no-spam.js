/*
 * $Id: unmunge_emails.js,v 1.6 2003/12/05 20:21:16 chip Exp $
 * $Source: /var/www/unicom.com/htdocs/RCS/unmunge_emails.js,v $
 *
 * Chip Rosenthal
 * Unicom Systems Development
 * <chip@unicom.com>
 *
 * unmunge_emails() - Remove anti-spam protection from email addresses.
 *
 * This routine allows you to "munge" mailto: links in a document (both
 * <a> and <link> tags), to hide them from spam address extractors.  For
 * instance, you can say something like:
 *
 *	<a href="mailto:spamkiller_chip_at_remove-this_dot_unicom_dot_com_dot_nowhere">mail me</a>
 *
 * This routine, when called, will rewrite the document so that becomes:
 *
 *	<a href="mailto:chip@unicom.com">mail me</a>
 *
 * The munging transformations you may use are:
 *
 *    - You may say "at" in place of the "@" character.
 *    - You may say "dot" in place of a "." character.
 *    - You may put "_" characters and spaces anywhere in the address.
 *    - You may place any "noise words" (described below) in the address.
 *
 * Although you can use either space or underscore as word separators, I
 * recommend underscore.  Space separators may confuse the browser or
 * mail program.  For instance, Mozilla (with javascript off) would treat
 * each word as a separate recipient.
 *
 * To use this function, you must do two things.  First, add within
 * the <head> element a line saying:
 *
 *	<script type="text/javascript" src="unmunge_emails.js"></script>
 *
 * (Adjust src= to point to this file.)
 *
 * Next, you must add an onLoad= parameter to your <body> tag, such as:
 *
 *	<body onLoad="unmunge_emails()">
 *
 * So, your document will look something like this:
 *
 *	<html>
 *	<head>
 *	<title>Demonstration Page</title>
 *	<script type="text/javascript" src="unmunge_emails.js">
 *	</head>
 *	<body onLoad="unmunge_emails()">
 *	    .
 *	    .
 *	web page contents, write out your mailto: links in munged format
 *	    .
 *	    .
 *	</body>
 *	</html>
 */

/*
 * EDIT THIS!!!
 *
 * Create your own list of "noise words" that should be removed from
 * email addresses.  You could use mine, but there is some danger if a
 * spammer gets hold of this script, they will start filtering out my
 * list of words.
 */
noise_words = new Array(
	"remove-this",
	"spamkiller",
	"nowhere"
);


function unmunge_emails()
{
	tags = document.getElementsByTagName("a");
	for (i = 0 ; i < tags.length ; ++i) {
		if (tags.item(i).href.match(/^mailto/)) {
			tags.item(i).href = unmunge_addr(tags.item(i).href);
		}
	}

	tags = document.getElementsByTagName("link");
	for (i = 0 ; i < tags.length ; ++i) {
		if (tags.item(i).href.match(/^mailto/)) {
			tags.item(i).href = unmunge_addr(tags.item(i).href);
		}
	}
}


function unmunge_addr(addr)
{

	// convert underscore to space
	addr = addr.replace(/_/g, " ");

	// filter out the noise words
	for (j in noise_words) {
		re = new RegExp('\\b' + noise_words[j] + '\\b', 'ig');
		addr = addr.replace(re, "");
	}

	// change "at" to "@"
	addr = addr.replace(/\bat\b/i, "@");

	// change "dot" to "."
	addr = addr.replace(/\bdot\b/ig, ".");

	// elide spaces 
	addr = addr.replace(/\s+/g, "");

	// collapse multiple dots to a single one
	addr = addr.replace(/\.+/g, ".");

	// remove dots around the "@", at front, at end
	addr = addr.replace(/\.?@\.?/, "@");
	addr = addr.replace(/\.$/, "");
	addr = addr.replace(/^mailto:\./, "mailto:");

	return addr;
}

