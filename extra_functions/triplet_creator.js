function triplet_creator(n_exemplars) {

    let all_refs = []
    let all_queries = []

    for (iT = 0; iT < n_exemplars; iT++) {

        // For each exemplar, generate all combinations of 2 from all the rest of exemplars
        let all_idxs = Array(n_exemplars).fill().map((element, index) => index)

        // Take all except iT
        all_idxs.splice(all_idxs.indexOf(iT), 1)

        // Create all possible permutations of n choose 2
        let refs = k_combinations(all_idxs, 2)

        // Create the array of the query items with the same length
        let queries = Array(refs.length).fill(iT)

        // Add these to the main variables
        all_refs.push(...refs)
        all_queries.push(...queries)

    }

    // Now, randomly, flip the referent orders
    let n_trials = all_refs.length
    let idx_sequences = Array(n_trials).fill().map((el, idx) => idx)

    let idx_to_flip = jsPsych.randomization.sampleWithoutReplacement(idx_sequences, n_trials / 2)

    for (iFlip = 0; iFlip < idx_to_flip.length; iFlip++) {

        let curr_idx = idx_to_flip[iFlip]

        all_refs[curr_idx] = all_refs[curr_idx].reverse()

    }

    return [all_refs, all_queries]

}