function trial_creator_triplets(parameters,n_reps,n_sessions){
    // debugger
    let all_trials = []

    var ref_left_idx, ref_right_idx

    for (iRep = 0; iRep<n_reps; iRep++){

        // Flip the ref_left and ref_right?
        if (iRep%2==0){
            ref_left_idx = 1
            ref_right_idx = 2
        } else {
            ref_left_idx = 2
            ref_right_idx = 1
        }
        
        for (iT=0; iT<parameters.length; iT++){

            let correct_response

            // Whats the "correct" response?
            if (parameters[iT].abs_dist_query_ref1 == parameters[iT].abs_dist_query_ref2){
                
                correct_response = null

            } else if (parameters[iT].abs_dist_query_ref1 < parameters[iT].abs_dist_query_ref2){
                if (ref_left_idx == 1){
                    correct_response = 'q'
                } else {
                    correct_response = 'p'
                }
            } else if (parameters[iT].abs_dist_query_ref1 > parameters[iT].abs_dist_query_ref2){
                if (ref_left_idx == 1){
                    correct_response = 'p'
                } else {
                    correct_response = 'q'
                }
            }

            let iTrial = {

                query_stimulus: 'img/jpg/neck_legs_space/dim_1_stim_' + parameters[iT].query + '_x_' + parameters[iT].query + '_y_110.jpg',
                ref_left_stimulus: 'img/jpg/neck_legs_space/dim_1_stim_' + parameters[iT]['ref'+ref_left_idx] + '_x_' + parameters[iT]['ref'+ref_left_idx] + '_y_110.jpg',
                ref_right_stimulus: 'img/jpg/neck_legs_space/dim_1_stim_' + parameters[iT]['ref'+ref_right_idx] + '_x_' + parameters[iT]['ref'+ref_right_idx] + '_y_110.jpg',
                ref_left_y_offset: Math.floor((Math.random()-0.5) * 200),
                ref_right_y_offset: Math.floor((Math.random()-0.5) * 200),
                correct_response: correct_response,

            }

            all_trials.push(iTrial)
        }

    }
    
    // Shuffle the array
    all_trials = jsPsych.randomization.shuffleNoRepeats(all_trials,function(a,b){return a.query_stimulus === b.query_stimulus})

    var all_sessions = []

    let n_trials_per_session = all_trials.length/n_sessions

    while(all_trials.length){
        all_sessions[all_sessions.length] = all_trials.splice(0,n_trials_per_session)
    }

    return all_sessions

}