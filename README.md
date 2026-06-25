# HNCancer - Atlas of Health Variation in Head and Neck Cancer in England

## About

NHCancer is a data visualisation project that allows public access to the results of research into cancer incidence and survival rates between 2016 and 2023. The data is spreadsheet based and used in conjunction with Apache ECharts to show dynamically generated tables and charts. The site allows searching by :

- region (9 UK regions)
- sex (male/female)
- deprivation level (IMD1-IMD5) 
- stage of diagnosis(early/advanced)
- route to clinical care (emergency/non-emergency)

### Project Team

| Name  | Role | Affiliation
| ------------- | ------------- | ------------- |
| Laura Woods  | PI | Newcastle University  |
| Becky Osselton | RSE  | Newcastle Universtiy  |

## Built With

[Astro](https://docs.astro.build/en/getting-started/)  
[Apache ECharts](https://echarts.apache.org/en/index.html)  

With help from the [Papa Parse](https://www.papaparse.com/) library to manage the import of CSV data.
  
### Prerequisites

Node.js must be installed, runs currently on node v24.

### Installation & Running Locally

Clone the repository as usual, then type:

`npm install` to create the node modules directory and install the dependencies.

Once complete, type `npm run dev` to run the application. http://localhost:4321/HNCancer/


### Running Tests

How to run tests on your local system.

## Deployment

Automated through an action file to deploy to GitHub pages. Currently live at https://newcastlerse.github.io/HNCancer/.

### Branches

Currenty dev and main.

https://nvie.com/posts/a-successful-git-branching-model/