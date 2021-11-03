/**
 * jspsych-triplets-keyboard-response
 * Levan Bokeria
 *
 **/


jsPsych.plugins["triplets-keyboard-response"] = (function () {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('triplets-keyboard-response', 'query_stimulus', 'image');
  jsPsych.pluginAPI.registerPreload('triplets-keyboard-response', 'ref_left_stimulus', 'image');
  jsPsych.pluginAPI.registerPreload('triplets-keyboard-response', 'ref_right_stimulus', 'image');

  plugin.info = {
    name: 'triplets-keyboard-response',
    description: '',
    parameters: {
      query_stimulus: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Query Stimulus',
        default: undefined,
        description: 'The query image to be displayed'
      },
      ref_left_stimulus: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'ref_left Stimulus',
        default: undefined,
        description: 'The ref_left image to be displayed'
      },
      ref_right_stimulus: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'ref_right Stimulus',
        default: undefined,
        description: 'The ref_right image to be displayed'
      },
      ref_left_y_offset: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'ref_left vertical offset',
        default: null,
        description: 'Amount of pixels to offset the ref_left from the center'
      },
      ref_right_y_offset: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'ref_right vertical offset',
        default: null,
        description: 'Amount of pixels to offset the ref_right from the center'
      },
      stimulus_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Image height',
        default: null,
        description: 'Set the image height in pixels'
      },
      stimulus_width: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Image width',
        default: null,
        description: 'Set the image width in pixels'
      },
      maintain_aspect_ratio: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Maintain aspect ratio',
        default: true,
        description: 'Maintain the aspect ratio after setting width or height'
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEY,
        array: true,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.'
      },
      stim_min_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Minimum Stimulus duration',
        default: null,
        description: 'How long to show the stimulus at the minimum.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when subject makes a response.'
      },
      post_response_delay: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Delay before the next trial',
        default: 0,
        description: 'After a response or a miss, how long to show the empty board before the next trial'
      }
    }
  }

  plugin.trial = function (display_element, trial) {

    // How many trials?
    // debugger
    let n_trials = jsPsych.data.get().values().filter(el => 'trial_stage' in el).length + 1

    // Create a flexbox at the top, for displaying which buttons to use and showing the trial counter
    var top_flex_el = document.createElement('div')

    top_flex_el.style.display = 'flex'
    top_flex_el['justify-content'] = 'space-between'

    var trial_counter_el = document.createElement('P')
    let n_total_trials = []

    if (jatos.studySessionData.inputData.session_counters.pre_exposure == 0) {
      n_total_trials = jatos.studySessionData.inputData.triplet_practice_trials[0].length
    } else if (jatos.studySessionData.inputData.session_counters.exposure == 0) {
      n_total_trials = jatos.studySessionData.inputData.pre_exposure_trials[0].length
    } else {
      n_total_trials = jatos.studySessionData.inputData.post_exposure_trials[0].length
    }

    trial_counter_el.innerText = 'Trial ' + n_trials + ' of ' + n_total_trials
    trial_counter_el.id = 'trial_counter'
    trial_counter_el.style['margin-bottom'] = '0px'

    // Create the elements for button instructions
    var left_button_text_el = document.createElement('P')
    left_button_text_el.innerText = 'Press "q" for the left bird'
    var right_button_text_el = document.createElement('P')
    right_button_text_el.innerText = 'Press "p" for the left bird'

    top_flex_el.appendChild(left_button_text_el)
    top_flex_el.appendChild(trial_counter_el)
    top_flex_el.appendChild(right_button_text_el)

    display_element.appendChild(top_flex_el)

    var feedback_text_el = document.createElement('P')
    feedback_text_el.innerText = 'missed...'
    feedback_text_el.style.visibility = 'visible'
    feedback_text_el.style['font-weight'] = 'bold'
    feedback_text_el.style.color = 'red'

    // debugger
    // Create an initial div as an arena
    wrapper_arena = document.createElement('div')
    wrapper_arena.id = 'wrapper_arena'
    wrapper_arena.style.height = '700px'
    wrapper_arena.style.width = '700px'
    wrapper_arena.style.border = '1px solid black'
    wrapper_arena.style.display = 'flex'
    wrapper_arena.style["justify-content"] = 'center'
    wrapper_arena.style["align-items"] = 'center'

    // Add the arena to the display element
    display_element.appendChild(wrapper_arena)
  
    // Create the ref_left element
    var ref_left_img_el_html = '<img src="' + trial.ref_left_stimulus + 
    '" class="stimuli" id="ref_left_img" style="height: ' + trial.stimulus_height.toString() + 
    'px; margin-top: ' + trial.ref_left_y_offset.toString() + 'px;">'

    var query_img_el_html = '<img src="' + trial.query_stimulus + 
    '" class="stimuli" id="query_img" style="height: ' + trial.stimulus_height.toString() + 
    'px; margin-right: 20px; margin-left: 20px;">'

    var ref_right_img_el_html = '<img src="' + trial.ref_right_stimulus + 
    '" class="stimuli" id="ref_right_img" style="height: ' + trial.stimulus_height.toString() + 
    'px; margin-top: ' + trial.ref_right_y_offset.toString() + 'px;">'    

    // wrapper_arena.appendChild(ref_right_img_el)
    wrapper_arena.innerHTML += ref_left_img_el_html
    wrapper_arena.innerHTML += query_img_el_html
    wrapper_arena.innerHTML += ref_right_img_el_html

    // store response
    var response = {
      rt: null,
      key: null
    };

    // function to end trial when it is time
    var end_trial = function () {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // gather the data to store for the trial
      var trial_data = {
        rt: response.rt,
        stimulus: trial.stimulus,
        response: response.key
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
    var after_response = function (info) {

      // only record the first response
      if (response.key == null) {
        response = info;
      }

      if (trial.response_ends_trial) {
        if (min_duration_over) {
          blank_board(info);
        }
      }
    };

    var blank_board = function (info) {

      // Make everything disappear
      document.querySelectorAll('.stimuli').forEach(item => item.remove())

      // Display 'missed' as the message if they missed!
      if (info.rt == null) {
        wrapper_arena.appendChild(feedback_text_el)
      }

      // End trial eventually
      jsPsych.pluginAPI.setTimeout(function () {
        end_trial();
      }, trial.post_response_delay);
    }

    var min_duration_over = false

    // Start the min stim duration timer
    if (trial.stim_min_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function () {
        min_duration_over = true

        if (response.key !== null) {
          blank_board(response);
        }

      }, trial.stim_min_duration)
    }

    // start the response listener
    if (trial.choices != jsPsych.NO_KEYS) {
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: 'performance',
        persist: false,
        allow_held_key: false
      });
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function () {
        let info = {
          rt: null
        }

        blank_board(info);
      }, trial.trial_duration);
    } else if (trial.response_ends_trial === false) {
      console.warn("The experiment may be deadlocked. Try setting a trial duration or set response_ends_trial to true.");
    }
  };

  return plugin;
})();
