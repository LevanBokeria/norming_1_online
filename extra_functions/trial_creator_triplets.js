function trial_creator_triplets(all_queries, all_refs, all_images, n_sessions,exemplar_start_level) {
    // debugger
    let all_trials = []

    for (iT = 0; iT < all_queries.length; iT++) {

        let correct_response

        // Whats the "correct" response?
        if (all_queries[iT] - all_refs[iT][0] == all_queries[iT] - all_refs[iT][1]) {

            correct_response = null

        } else if (all_queries[iT] - all_refs[iT][0] < all_queries[iT] - all_refs[iT][1]) {

            correct_response = 'q'

        } else if (all_queries[iT] - all_refs[iT][0] > all_queries[iT] - all_refs[iT][1]) {

            correct_response = 'p'

        }

        let iTrial = {

            query_stimulus:     `img/object-9_50-levels_1D/object9F0Level${exemplar_start_level + all_queries[iT]}F1Level14.png`,
            ref_left_stimulus:  `img/object-9_50-levels_1D/object9F0Level${exemplar_start_level + all_refs[iT][0]}F1Level14.png`,
            ref_right_stimulus: `img/object-9_50-levels_1D/object9F0Level${exemplar_start_level + all_refs[iT][1]}F1Level14.png`,
  
            correct_response: correct_response,

        }

        all_trials.push(iTrial)
    }

    // Shuffle the array
    all_trials = jsPsych.randomization.shuffleNoRepeats(all_trials, function (a, b) { return a.query_stimulus === b.query_stimulus })

    var all_sessions = []

    let n_trials_per_session = all_trials.length / n_sessions

    while (all_trials.length) {
        all_sessions[all_sessions.length] = all_trials.splice(0, n_trials_per_session)
    }

    return all_sessions

}