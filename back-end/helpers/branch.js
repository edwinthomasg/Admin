// CREATE FEATURE BRANCH WITH TIMESTAMP
const createBranch = () => {
    let date = new Date()
    let branch = `${process.env.FEATURE_BRANCH_BASE}/${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}/${date.getTime()}`
    return branch
}

module.exports = createBranch