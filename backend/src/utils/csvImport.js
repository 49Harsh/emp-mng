const { parse } = require('csv-parse');
const { Readable } = require('stream');

/**
 * Parse CSV buffer/string into array of objects
 * @param {Buffer|string} input
 * @returns {Promise<Array>}
 */
const parseCSV = (input) => {
  return new Promise((resolve, reject) => {
    const records = [];
    const stream = Readable.from(input.toString());

    stream
      .pipe(
        parse({
          columns: true,
          skip_empty_lines: true,
          trim: true,
        })
      )
      .on('data', (row) => records.push(row))
      .on('end', () => resolve(records))
      .on('error', (err) => reject(err));
  });
};

/**
 * Map CSV row to employee fields
 */
const mapCSVRowToEmployee = (row) => ({
  name: row.name || row.Name,
  email: (row.email || row.Email || '').toLowerCase(),
  phone: row.phone || row.Phone,
  department: row.department || row.Department,
  designation: row.designation || row.Designation,
  salary: parseFloat(row.salary || row.Salary) || undefined,
  joiningDate: row.joiningDate || row.joining_date || row['Joining Date'],
  status: (row.status || row.Status || 'active').toLowerCase(),
  role: (row.role || row.Role || 'employee').toLowerCase(),
});

module.exports = { parseCSV, mapCSVRowToEmployee };
