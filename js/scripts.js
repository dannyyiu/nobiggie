// ====== GLOBALS =======
var poseHistory = []; // history of poses URLs already shown
var poseDirs = []; // list of pose directories from posemaniacs.com/data.php

$(document).ready(function() {

  // ======= PAGE LOAD =======
  // populate pose directories locally
  $.get('js/pose_dir.dat', function(txt) {
    poseDirs = txt.split("\n");
    $("#pose-img1").attr('src', getPoseURL()); // preload first pose
    $("#pose-img2").attr('src', getPoseURL()); // preload second pose
    fullsizePose($("#pose-img1")); // resize to fit screen
    fullsizePose($("#pose-img2"));
  });

  // ======= EVENTS ========

  // timer buttons toggle
  $("#timer-select .btn-primary").click(function(event) {
    $(".btn-primary").removeClass("active");
    $(this).addClass("active");
  });

  // countdown checkbox toggle
  $("#countdown-select").change(function(event) {
    toggleCheckbox($(this));
  });

  // fullscreen toggle button
  $("#fullscreen-btn").click(function(event) {
    event.preventDefault();
    toggleFullScreen();
  });

  // start button, main event start
  $("#start-btn").click(function(event) {
    event.preventDefault();
    // hide main menu and show pose container
    $("#init").fadeOut('fast');
    $("#pic").show();

    var timeoutVal = parseInt($("#timer-select .active").text().slice(0,-1)) * 1000;
    // check if countdown is needed
    var countdown = false;
    if ($("#countdown-select").attr('checked')) {
      countdown = true;
    }
    // set action for interval timer
    var action = function() {
      // countdown if selected by user
      if (countdown == true) {
        showCountdown(); 
      } else {
        // toggle images
        togglePoseContainer();
        // preload next
        preloadNextPose();
      };
    };
    // start interval timer, run infinitely
    setInterval(action, timeoutVal);

  });

});

function showCountdown() {
  // hide poses and show countdown screen
  $("#pic").fadeOut('fast');
  $("#countdown").fadeIn('fast');

  // start countdown
  var counter = 3;
  $("#count").text(counter.toString());
  var interval = setInterval(function() {
    counter--;
    $("#count").text(counter.toString());
    if (counter == 0) {
      // show next pose
      $("#countdown").fadeOut('fast');
      $("#pic").fadeIn('fast');
      // toggle images
      togglePoseContainer();
      // preload next
      preloadNextPose();
      clearInterval(interval);
    };
  }, 1000);
};

function preloadNextPose() {
  // preload next image in hidden image tag
  if ($("#pose-img1").is(":visible")) {
    $("#pose-img2").attr('src', getPoseURL());
    fullsizePose($("#pose-img2"));
  } else {
    $("#pose-img1").attr('src', getPoseURL());
    fullsizePose($("#pose-img1"));
  }
}

function togglePoseContainer() {
  // toggle hidden and shown image tags
  if ($("#pose-img1").is(":visible")) {
    $("#pose-img1").hide();
    $("#pose-img2").show();
  } else {
    $("#pose-img2").hide();
    $("#pose-img1").show();
  }
}


function getPoseURL() {
  // example format: http://posemaniacs.com/pose/m4_Taekwondo/h0_v45/pose__0019.jpg
  // image filenames will always include 4 digit numbers preceded by 0's between
  // the range of 1 and 36
  var urlbase = "http://posemaniacs.com/pose/";
  var dir = "";
  var dir = poseDirs[Math.floor(poseDirs.length * Math.random())] + "/";

  // check if pose has been shown before in history
  while ($.inArray(dir, poseHistory) >= 0 || dir == "") {
    dir = poseDirs[Math.floor(poseDirs.length * Math.random())] + "/";
  };
  poseHistory.push(dir); // add to history

  // build and return URL
  var rand = Math.floor((Math.random() * 36) + 1);
  var fname = "pose_" + ("000" + rand.toString()).substr(-4,4) + ".jpg";
  var url = urlbase + dir + fname;
  return url;
}

function toggleCheckbox(element) {
  // toggle checkbox input's checked attribute
  if (element.attr('checked')) {
    element.removeAttr('checked');
  } else {
    element.attr('checked', 'checked');
  };
};

function fullsizePose(element) {
  var width, height;
  $("<img/>")
    .attr('src', element.attr('src'))
    .load(function() {
      width = this.width;
      height = this.height;
    });
  if (width >= height) {
    element.css("min-width", "100%");
  } else {
    element.css("min-height", "100%");
  }
}

function toggleFullScreen() {
  if (!document.fullscreenElement &&    // alternative standard method
      !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) {
      document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}