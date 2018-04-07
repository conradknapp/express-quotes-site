const moment = require('moment');

module.exports = {
  formatDate: (date, format) => {
    return moment(date).format(format);
  },
  editIcon: (quoteUser, loggedUser, quoteId, flag = true) => {
    if (quoteUser === loggedUser) {
      if (bool) {
        return `<a href="/quotes/edit/${quoteId}" class="edit"><i class="material-icons">edit</i></a>`
      } else {
        return `<a href="/quotes/edit/${quoteId}"><i class="material-icons">edit</i></a>`
      }
    } else {
      return ''
    }
  }
}