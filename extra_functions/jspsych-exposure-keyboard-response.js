/**
 * jspsych-exposure-keyboard-response
 * Levan Bokeria
 *
 **/


jsPsych.plugins["exposure-keyboard-response"] = (function () {

  var plugin = {};

  // jsPsych.pluginAPI.registerPreload('exposure-keyboard-response', 'stimulus', 'image');

  plugin.info = {
    name: 'exposure-keyboard-response',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Query Stimulus',
        default: undefined,
        description: 'The query image to be displayed'
      },
      y_offset: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'vertical offset',
        default: null,
        description: 'Amount of pixels to offset vertically from the center'
      },
      x_offset: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'horizontal offset',
        default: null,
        description: 'Amount of pixels to offset horizontally from the center'
      },
      stimulus_height: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Image height',
        default: 400,
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
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },
      stim_min_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Minimum Stimulus duration',
        default: null,
        description: 'How long to show the stimulus at the minimum.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when subject makes a response.'
      },
    }
  }

  plugin.trial = function (display_element, trial) {


    // How many trials?
    // debugger

    // Create a flexbox at the top, for displaying which buttons to use and showing the trial counter
    var top_flex_el = document.createElement('div')

    top_flex_el.style.display = 'flex'
    top_flex_el['justify-content'] = 'space-between'

    let n_trials = jsPsych.data.get().values().filter(el => el.trial_stage == 'exemplar_display').length + 1
    let trial_counter_el = document.createElement('P')
    trial_counter_el.innerText = 'Trial ' + n_trials + ' of ' + jatos.studySessionData.inputData.exposure_trials[0].length
    trial_counter_el.id = 'trial_counter'

    // Create the elements for button instructions
    var left_button_text_el = document.createElement('P')
    left_button_text_el.innerText = '"q" = same as previous'
    var right_button_text_el = document.createElement('P')
    right_button_text_el.innerText = '"p" = different from previous'

    top_flex_el.appendChild(left_button_text_el)
    top_flex_el.appendChild(trial_counter_el)
    top_flex_el.appendChild(right_button_text_el)

    display_element.appendChild(top_flex_el)

    // debugger
    // Create an initial div as an arena
    wrapper_arena = document.createElement('div')
    wrapper_arena.id = 'wrapper_arena'
    wrapper_arena.style.height = '700px'
    wrapper_arena.style.width = '700px'
    wrapper_arena.style.border = '1px solid black'

    // Create prompt
    var prompt_el = document.createElement('P')
    prompt_el.innerText = trial.prompt
    prompt_el.id = 'prompt_el'

    wrapper_arena.appendChild(prompt_el)

    // Create the query image element
    var stimulus_el = document.createElement('img')

    stimulus_el.src = trial.stimulus

    stimulus_el.className = 'stimuli'
    stimulus_el.id = 'stimulus'

    stimulus_el.style.height = trial.stimulus_height.toString() + 'px'
    stimulus_el.style.width = stimulus_el.naturalWidth * stimulus_el.style.height / stimulus_el.naturalHeight
    stimulus_el.style['margin-top'] = trial.y_offset.toString() + 'px'
    stimulus_el.style['margin-left'] = trial.x_offset.toString() + 'px'

    wrapper_arena.appendChild(stimulus_el)

    // Add the arena to the display element
    display_element.appendChild(wrapper_arena)

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
        if(min_duration_over){
          end_trial();
        }
      }
    };

    var min_duration_over = false

    // Start the min stim duration timer
    if (trial.stim_min_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function () {
        min_duration_over = true

        if(response.key !== null){
          end_trial();
        }

      }, trial.stim_min_duration)
    }


    if (trial.choices != jsPsych.NO_KEYS) {
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: 'performance',
        persist: false,
        allow_held_key: false
      });
    }

    // hide stimulus if stimulus_duration is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function () {
        display_element.querySelector('#jspsych-exposure-keyboard-response-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function () {
        end_trial();
      }, trial.trial_duration);
    } else if (trial.response_ends_trial === false) {
      console.warn("The experiment may be deadlocked. Try setting a trial duration or set response_ends_trial to true.");
    }
  };

  return plugin;
})();
