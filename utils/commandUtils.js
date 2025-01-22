/**
 * Kiểm tra xem lệnh có thuộc danh mục cụ thể hay không.
 * @param {Object} command - Lệnh cần kiểm tra.
 * @param {string} category - Danh mục cần kiểm tra.
 * @returns {boolean} - Trả về true nếu lệnh thuộc danh mục, ngược lại false.
 */
function isCommandInCategory(command, category) {
    return command.category && command.category.toLowerCase() === category.toLowerCase();
  }
  
  module.exports = { isCommandInCategory };