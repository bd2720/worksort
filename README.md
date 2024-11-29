# WorkSort
Streamline the application process using **WorkSort**, a job posting organizer. **WorkSort** is a web app designed for bookmarking and organizing job postings. Add, tag, search and sort the jobs you've applied for, keeping your job application process on track.

### [Click here to try it out!](https://bd2720.github.io/worksort)

## How to Use
* Click the `New Job` button to start entering information about a job offer you'd like to bookmark. In the input fields, enter the **Title**, **Company** and **Date** associated with the offer (it is also recommended to add the **URL**). You may also add some **Notes** or **Tags**. After specifying the **Table** to insert the job into, click `Add Job` to append the offer to the specified list of job offers.
* Click a job's `...` button to view, edit or delete the information associated with that particular job listing.
* Click `New Table` to create and name a new table.
* Use `<` and `>` to navigate between different tables.
* Rename or delete the selected job table with the `Edit` and `Delete` buttons to the right of (or below) the table name.
  * *Note:* A table must be empty before it can be deleted. The *Main* table cannot be renamed or deleted. Two tables may not share the same name.
* Click a table's column headers **Title**, **Company**, and **Date** to sort by column value and toggle sorting order. 
* Search across all jobs using the `Search Jobs` button. Fill out any fields you'd like, including **Title**, **Company**, **To Date**, **From Date**, **Tags** and **Tables**, then press `Search` to display results.
  * *Note:* If you don't want to filter on a particular field, just leave it blank.

## How it Works
**WorkSort** is written in Vue.js, JavaScript, CSS and HTML. Each facet of **WorkSort** is split into Vue components, such as JobTable, JobIcon and SearchFields. State is mainly managed by the parent component, App.vue, allowing children components to communicate using props and emits. The Vue.js frontend provides input fields to add, edit and delete jobs and tables from the jobData database, which is created and managed using IndexedDB. A wrapper library called Dexie.js provides simplified access to the IndexedDB database, allowing for reactive queries and complex searches. The vue3-tags-input component enables custom tags to be assigned to each job. If a link is provided with a job entry, googleusercontent API allows the link's icon to be displayed. Frontend design is responsive, and has been tested across multiple browsers and systems, including iOS devices.

## Coming Soon
* ~~Style~~
* ~~Notes field for each job listing~~
* ~~Saved history~~
* ~~Categories (Default and Custom)~~
* ~~Tags~~
* ~~Search feature~~
* ~~Sort feature~~
* ~~Release version~~
