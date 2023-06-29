/* retrieve data from heroku postgresql database as json and console.log each entry
 * Run it like this: node cli.js
 */

const util = require('util');
const exec = util.promisify(require('child_process').exec);
async function lsWithGrep() {
  try {
    const { stdout, stderr } = await exec(
      "heroku pg:psql -c 'select array_to_json(array_agg(to_json(blogs))) from blogs;'"
    );
    /* query returns addition characters outside of the array
     * so we need to filter the array string */
    const json = stdout.match(/\[(.*?)\]/g);
    const blogs = JSON.parse(json);
    blogs.forEach((blog) => {
      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`);
    });
  } catch (err) {
    console.error(err);
  }
}
lsWithGrep();
