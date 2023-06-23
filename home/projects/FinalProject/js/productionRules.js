var ProductionRules = React.createClass({

    getInitialState: function() {
        return {
          collapsed: false,
          nextRuleName: Object.keys(this.props.productionRules)[0],
        };
    },

    addProductionRule: function() {
      const nextProductionRules = {...this.props.productionRules};
      console.log(nextProductionRules);
      nextProductionRules[this.state.nextRuleName].push(
          {
            source: this.props.primitives[this.state.nextRuleName],
            weight: 1,
            productions: [{
              primitive: this.props.primitives[this.state.nextRuleName],
              transformations: [{scale: 1, rotation: 0, transX: 0, transY: 0}],
              matrix: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
            }],
          }
      );
      this.props.handleProductionRulesChange(nextProductionRules);
    },

    renderNextRuleSelect: function() {
        var ruleNames = [];
        for (p in this.props.productionRules) {
            ruleNames.push(p);
        }

        var select = <select
            value={this.state.nextRuleName}
            onChange={this.handleNextRuleSelect}
            id={"selectNextProductionRule"}>
                {ruleNames.map(function(name) {
                    return <option
                        value={name}
                        key={name}>
                            {name}
                        </option>
                })}
        </select>;

        return select;
    },

    handleNextRuleSelect: function() {
        var select = document.getElementById("selectNextProductionRule").value;
      this.setState({nextRuleName: select});
    },

    handleCollapseClick: function() {
        this.setState({collapsed: true});
    },

    handleExpandClick: function() {
        this.setState({collapsed: false});
    },

    render: function() {
        var productionRules = [];
        for (var rule in this.props.productionRules) {
            productionRules.push(...this.props.productionRules[rule]);
        }

        var collapseString = "(Click to Collapse this Panel)";
        var display = "inline";
        var clickHandler = this.handleCollapseClick;
        if (this.state.collapsed) {
            collapseString = "(Click to Expand this Panel)";
            display= "none";
            clickHandler = this.handleExpandClick;
        }

        return (
            <div className="menu">
                <h2>{"Production Rules"}</h2>
                <span style={{display: display}}>
                    {productionRules.map(function(rule, i) {
                        return (<span key={"spP_" + rule.source.name + i}>
                            {"Source Symbol: " + rule.source.name}
                            <Production {...this.props}
                                key={"productionRule_" + rule.source.name + i}
                                rule={rule}
                                name={rule.source.name}
                                index={i}
                            />
                            <div className="divider" key={"divP_"+rule.source.name}></div>
                        </span>);
                    }.bind(this))}
                    <button className="fancyButton" onClick={this.addProductionRule}>
                      "Add Rule"
                    </button>
                    {this.renderNextRuleSelect()}
                </span>
            </div>
        );
        return null;
    }
});
