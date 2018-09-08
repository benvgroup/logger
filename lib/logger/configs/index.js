/**
 * Export config set for benv.
 * @type {Object}
 */
exports.benv = {
  // We rather use a more expressive logging steps. We could have used
  // those defined for syslogs but I don't like how they used some
  // random abbreviations for levels like critical and emergency
  levels: {
    emergency: 0,
    alert: 1,
    critical: 2,
    error: 3,
    warning: 4,
    notice: 5,
    info: 6,
    debug: 7,
  },
  // https://github.com/winstonjs/winston#using-custom-logging-levels
  // Font styles: bold, dim, italic, underline, inverse, hidden, strikethrough
  // Font foreground colors: black, red, green, yellow, blue, magenta, cyan, white, gray, grey
  // Background colors: blackBG, redBG, greenBG, yellowBG, blueBG magentaBG, cyanBG, whiteBG
  colors: {
    emergency: 'redBG bold white',
    alert: 'redBG white',
    critical: 'bold red',
    error: 'red',
    warning: 'yellow',
    notice: 'green',
    info: 'gray',
    debug: 'dim gray',
  },
};
