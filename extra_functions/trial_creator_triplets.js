function trial_creator_triplets(all_queries, all_refs, all_images, n_sessions) {
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

            query_stimulus:     all_images[all_queries[iT]],
            ref_left_stimulus:  all_images[all_refs[iT][0]],
            ref_right_stimulus: all_images[all_refs[iT][1]],
            ref_left_y_offset: 0,
            ref_right_y_offset: 0,
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