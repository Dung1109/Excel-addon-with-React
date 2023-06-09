import * as React from "react";
import PropTypes from "prop-types";
import { DefaultButton } from "@fluentui/react";
import Header from "./Header";
import HeroList from "./HeroList";
import Progress from "./Progress";

/* global console, Excel, require */

export default class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      listItems: [],
    };
  }

  componentDidMount() {
    this.setState({
      listItems: [
        // {
        //   icon: "Ribbon",
        //   primaryText: "Achieve more with Office integration",
        // },
        // {
        //   icon: "Unlock",
        //   primaryText: "Unlock features and functionality",
        // },
        // {
        //   icon: "Design",
        //   primaryText: "Create and visualize like a pro",
        // },
      ],
    });
  }

  click = async () => {
    try {
      await Excel.run(async (context) => {
        /**
         * Insert your Excel code here
         */
        const range = context.workbook.getSelectedRange();

        // Read the range address
        range.load("address");

        // get the value from cell A1 and write it to cell B1
        const sheet = context.workbook.worksheets.getActiveWorksheet();
        const rangeA1 = sheet.getRange("A1");
        rangeA1.load("values, address");
        const rangeB1 = sheet.getRange("B1");

        await context.sync();
        rangeB1.values = rangeA1.values;

        let rng = sheet.getUsedRange();
        let lastCell = rng.getLastCell();
        lastCell.load("address");
        await context.sync();

        console.log(lastCell.address);

        // const rangeLast = sheet.getRange("A1").getSpecialCells("LastCell");
        // console.log(rangeLast.address);
        // rangeLast.values = 2000;

        // Update the fill color
        range.format.fill.color = "yellow";

        await context.sync();
        console.log(`The range address was ${range.address}.`);
      });
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    const { title, isOfficeInitialized } = this.props;

    if (!isOfficeInitialized) {
      return (
        <Progress
          title={title}
          logo={require("./../../../assets/logo-filled.png")}
          message="Please sideload your addin to see app body."
        />
      );
    }

    return (
      <div className="ms-welcome">
        <Header logo={require("./../../../assets/logo-filled.png")} title={this.props.title} message="Welcome" />
        <HeroList message="Discover Office Add-ins!" items={this.state.listItems}>
          <p className="ms-font-l">
            Modify the source files, then click <b>Run</b>.
          </p>
          <DefaultButton className="ms-welcome__action" iconProps={{ iconName: "ChevronRight" }} onClick={this.click}>
            Click to run
          </DefaultButton>
        </HeroList>
      </div>
    );
  }
}

App.propTypes = {
  title: PropTypes.string,
  isOfficeInitialized: PropTypes.bool,
};
