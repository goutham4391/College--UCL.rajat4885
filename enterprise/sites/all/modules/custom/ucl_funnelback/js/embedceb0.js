'use strict';

/**
 * Article template
 */
var Article = function Article(_ref) {
  var url = _ref.url,
      img = _ref.img,
      title = _ref.title,
      org_unit = (typeof _ref.org_unit != "undefined"?_ref.org_unit.replace(/\|/g, ", "):""),
      snippet = _ref.snippet,
      date = _ref.date,
      org_unit_name = _ref.org_unit_name,
      event_location = _ref.event_location,
      event_location_building = (typeof _ref.event_location_building != "undefined"?_ref.event_location_building:""),
      comm_type = _ref.comm_type;

  if (typeof img != "undefined" && img !== "") {
    img = img.replace(/(^\w+:|^)/, '');
    return '\n  <article class="feed__item feed--small-image caption-img ' + comm_type + '">\n    \n    <div class="feed__image"><a href="' + url + '"><img typeof="foaf:Image" src="' + img + '" alt="' + title + '"></a></div><div class="feed__text-content"> \n    \n    <h3 class="heading feed__item-heading">\n        <a href="' + url + '">' + title + '</a>  </h3>\n    \n    ' + (snippet ? '<p class="feed__snippet">' + snippet + '</p>' : '') + '\n    ' + (org_unit_name ? '<p class="school">' + org_unit + '</p>' : '') + '\n    ' + (event_location ? '<p class="school">' + event_location_building + '</p>' : '') + '\n    ' + (date ? '<p class="feed__publish-date"><time>' + date + '</time></p>' : '') + '\n </div>   \n  </article>\n';
  } else {
    return '\n   <article class="feed__item feed--small-image caption-img ' + comm_type + '">\n <div class="feed__text-full-width">  \n'
      + '\n    \n    <h3 class="heading feed__item-heading">\n        <a href="' + url + '">' + title + '</a>  </h3>\n    \n    ' + (snippet ? '<p class="feed__snippet">' + snippet + '</p>' : '') + '\n    ' + (org_unit_name ? '<p class="school">' + org_unit + '</p>' : '') + '\n    ' + (event_location ? '<p class="school">' + event_location_building + '</p>' : '') + '\n    ' + (date ? '<p class="feed__publish-date"><time>' + date + '</time></p>' : '') + ' </div>\n    \n </article>\n';
  }
};

var monthsFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function pad(n) {
  return n < 10 ? "0" + n : n;
}

function tConvert (time) {
    // Check correct time format and split into components
    time = time.toString().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) { // If time format correct
        time = time.slice (1);  // Remove full string match value
        time[3] = +time[0] < 12 ? 'am' : 'pm'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
        if(time[2]==="00"){
            time[2]="";
            time[1]="";
        }
    }
    return time.join (''); // return adjusted time or original string
}


function failMessage(){$(".loading-message").html(Drupal.t("<p>There is a problem with this content. Please try again later.</p>"))}

jQuery(document).ready(function () {

  jQuery('ucl-funnelback').each(function (n,item) {

    jQuery(item).css("display", "none");
    jQuery(item).before('<div class="loading-message"><img src='+ "//" + Drupal.settings.ucl.cdnPath + '/skins/UCLIndigoSkin/default-theme/images/iris/ajax-loader.gif><br>Please wait while the feed is loading... </div>');
    var feed = jQuery(this);
    var feedUrl = feed.attr('feed');
    var feedElement = this;
    var totalResults = 0;

    if (feed.attr('items') > 0) {
      feedUrl = feedUrl + '&num_ranks=' + feed.attr('items');
    }
    jQuery.ajax({
      timeout: 10000,
      error: function failure() {
        if (jQuery(item).siblings(".loading-message").first().is("div")) {
          jQuery(item).siblings(".loading-message").first().html(Drupal.t("<p>There is a problem with this content. Please try again later.</p>"));
        }
      },
      url: feedUrl, success: function success(result) {
        totalResults = result.response.resultPacket.resultsSummary.fullyMatching;
        if (totalResults === 0) {
          jQuery(item).prev(".loading-message").css("display", "none");
          jQuery(item).html("<p>There are no items in this feed. This could be because there is currently no content for the filters or keywords used for the feed. You could try visiting the homepage or news and events pages.</p>");
        }
        // Update articles
        var articles = [];
        for (var i = 0; i < result.response.resultPacket.results.length; i++) {
          var article = result.response.resultPacket.results[i];
          var d, date_string, start_date_string, start_time_string, d_end, end_time_string, end_date_string, event_location_building;
          var communication_type = article.metaData.UclCommunicationType;

            if(communication_type != null)
            {
                if (communication_type.indexOf("Event") > -1) {
                    d = new Date(article.metaData.UCLEventStartDate);
                    start_date_string = d.getDate() + ' ' + monthsFull[d.getMonth()] + ' ' + d.getFullYear();
                    start_time_string = pad(d.getHours()) + ':' + pad(d.getMinutes());
                    start_time_string = tConvert(start_time_string);
                    if (article.metaData.UCLEventEndDate) {
                        d_end = new Date(article.metaData.UCLEventEndDate);
                        end_date_string = d_end.getDate() + ' ' + monthsFull[d_end.getMonth()] + ' ' + d_end.getFullYear();
                        end_time_string = pad(d_end.getHours()) + ':' + pad(d_end.getMinutes());
                        end_time_string = tConvert(end_time_string);
                        if (start_date_string !== end_date_string) {
                          date_string = start_date_string + '–' + end_date_string + ', ' + start_time_string + '–' + end_time_string;
                        } else {
                          date_string = start_date_string + ', ' + start_time_string + '–' + end_time_string;
                        }
                    }
                } else if (communication_type.indexOf("Silva Agenda Item") > -1) {
                    d = new Date(article.metaData.UCLEventStartDate);
                    start_date_string = d.getDate() + ' ' + monthsFull[d.getMonth()] + ' ' + d.getFullYear();
                    if (article.metaData.UCLEventEndDate) {
                        d_end = new Date(article.metaData.UCLEventEndDate);
                        end_date_string = d_end.getDate() + ' ' + monthsFull[d_end.getMonth()] + ' ' + d_end.getFullYear();
                        if (start_date_string !== end_date_string) {
                          date_string = start_date_string + '–' + end_date_string;
                        } else {
                            date_string = start_date_string;
                        }
                    }
                }

                else {
                    d = new Date(article.metaData.PublishedDate);
                    date_string = d.getDate() + ' ' + monthsFull[d.getMonth()] + ' ' + d.getFullYear();
                }
                communication_type = communication_type.replace(/\s+/g, '-').replace(/\|/g, ' ').toLowerCase();
            } else {
                d = new Date(article.metaData.PublishedDate);
                date_string = d.getDate() + ' ' + monthsFull[d.getMonth()] + ' ' + d.getFullYear();
                communication_type = "";
            }
          var snippet_string = article.metaData.c ? article.metaData.c : '';
          articles.push({
            url: article.liveUrl,
            img: jQuery(feedElement).attr('images') == 'checked' || jQuery(feedElement).attr('images') == 'true' ? article.metaData.I : '',
            title: article.metaData.FeedTitle,
            org_unit: article.metaData.UclOrgUnit,
            snippet: jQuery(feedElement).attr('showsnippet') == 'checked' || jQuery(feedElement).attr('showsnippet') == 'true' ? snippet_string : '',
            date: jQuery(feedElement).attr('dates') == 'checked' || jQuery(feedElement).attr('dates') == 'true' ? date_string : '',
            org_unit_name: jQuery(feedElement).attr('orgunitname') == 'checked' || jQuery(feedElement).attr('orgunitname') == 'true' ? true : '',
            event_location_building: article.metaData.UclEventLocationBuilding,
            event_location: jQuery(feedElement).attr('eventlocationname') == 'checked' || jQuery(feedElement).attr('eventlocationname') == 'true' ? true : '',
            comm_type: communication_type
          });
        }

        // Update page
        var feedhtml = articles.map(Article).join('');
        if (feedhtml) {
          // Inject results where they exist.
          jQuery(feedElement).html('<section id="ucl-funnelback-search">' + feedhtml + '</section>');
        }
        else {
          // Hide any section headings that have no results.
          jQuery(item).prev().prev("h3").css("display", "none");
        }


        // Add more link
        if (jQuery(feedElement).attr('moreurl') != '' && jQuery(feedElement).attr('moreurl')) {
          jQuery(feedElement).append('<a href="' + jQuery(feedElement).attr('moreurl') + '">' + jQuery(feedElement).attr('moretext') + '</a>');
        }
        jQuery(item).prev(".loading-message").css("display", "none");
        jQuery(item).fadeIn("slow");
      } });
  });
});
