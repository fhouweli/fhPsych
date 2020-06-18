// CONSTANTS
var TODAY = new Date();
var SEC = String(TODAY.getSeconds()).padStart(2, '0');  // fh
var DD = String(TODAY.getDate()).padStart(2, '0');
var MM = String(TODAY.getMonth() + 1).padStart(2, '0');
var YYYY = TODAY.getFullYear();
const DATE = YYYY + MM + DD + "_" + SEC;

    /* create timeline */
    var timeline = [];


    /* define welcome message trial */
    var welcome = {
      data: {
        screen_id: "welcome"
      },
      type: "html-keyboard-response",
      stimulus: "Welcome to the experiment. Press any key to begin.",
//      on_finish: function(data) {
//        responses = JSON.parse(data.responses);
//        jsPsych.data.addProperties({
//            part_ID: responses.Part_ID,
//            ID_DATE:  DATE
//        })
    };
    timeline.push(welcome);

    /* define instructions trial */
    var instructions = {
      data: {
        screen_id: "instructions"
      },
      type: "html-keyboard-response",
      stimulus: "<p>In this experiment, a circle will appear in the center " +
          "of the screen.</p><p>If the circle is <strong>blue</strong>, " +
          "press the letter F on the keyboard as fast as you can.</p>" +
          "<p>If the circle is <strong>orange</strong>, press the letter J " +
          "as fast as you can.</p>" +
          "<div style='width: 700px;'>"+
          "<div style='float: left;'><img src='../img/blue.png'></img>" +
          "<p class='small'><strong>Press the F key</strong></p></div>" +
          "<div class='float: right;'><img src='../img/orange.png'></img>" +
          "<p class='small'><strong>Press the J key</strong></p></div>" +
          "</div>"+
          "<p>Press any key to begin.</p>",
      post_trial_gap: 1000
    };
    timeline.push(instructions);

    /* test trials */
    var test_stimuli = [
      { stimulus: "../img/blue.png",
        data: {
          test_part: 'test',
          correct_response: 'f'
        }
      },
      { stimulus: "../img/orange.png",
        data: {
          test_part: 'test',
          correct_response: 'j'
        }
      }
    ];

    var fixation = {
      type: 'html-keyboard-response',
      stimulus: '<div style="font-size:60px;">+</div>',
      choices: jsPsych.NO_KEYS,
      trial_duration: function(){
        return jsPsych.randomization.sampleWithoutReplacement([250, 500, 750, 1000, 1250, 1500, 1750, 2000], 1)[0];
      },
      data: {test_part: 'fixation'}
    }

    var test = {
      type: "image-keyboard-response",
      stimulus: jsPsych.timelineVariable('stimulus'),
      choices: ['f', 'j'],
      data: jsPsych.timelineVariable('data'),
      on_finish: function(data){
        data.correct = data.key_press == jsPsych.pluginAPI.convertKeyCharacterToKeyCode(data.correct_response);
      }
    }

    var test_procedure = {
      timeline: [fixation, test],
      timeline_variables: test_stimuli,
      randomize_order: true,
      repetitions: 1
    }

    timeline.push(test_procedure);

    var debrief_block = {
      data: {
        screen_id: "debrief"
      },

      type: "html-keyboard-response",
      stimulus: function() {

        var trials = jsPsych.data.get().filter({test_part: 'test'});
        var correct_trials = trials.filter({correct: true});
        var accuracy = Math.round(correct_trials.count() / trials.count() * 100);
        var rt = Math.round(correct_trials.select('rt').mean());

        return "<p>You responded correctly on "+accuracy+"% of the trials.</p>"+
        "<p>Your average response time was "+rt+"ms.</p>"+
        "<p>Press any key to complete the experiment. Thank you!</p>";

      }
    };
    timeline.push(debrief_block);


    function startExp() {
        jsPsych.init({
            timeline: timeline,
            on_interaction_data_update: function(data) {
                // get the main trial data
                var trial = jsPsych.currentTrial();
                trial.data.screen_focus = data.event;
            },
            on_finish: function() {
                $.ajax({
                    type: "POST",
                    url: "/experiment-data",
                    data: JSON.stringify(jsPsych.data.get().values()),
                    contentType: "application/json"
                }).done(function() {
                    window.location.href = "finish";
                }).fail(function() {
                    alert("Problem occurred while writing data to Dropbox. " +
                        "Data will be saved to your computer. " +
                        "Please contact the experimenter regarding this issue!");
                    var csv = jsPsych.data.get().csv();
                    var filename = jsPsych.data.get().values()[0].part_ID + "_" + DATE + ".csv";
                    downloadCSV(csv, filename);
                    window.location.href = "finish";
                });
            }
        })
    }