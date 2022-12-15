const createFeatureBranch = () => {
    let date = new Date()
    let branch = `${process.env.FEATURE_BRANCH_BASE}/${date.getDate()}-${date.getMonth()}-${date.getFullYear()}/${date.getTime()}`
    return branch
}

module.exports = createFeatureBranch