// Copyright 2021 The Casdoor Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from "react";
import * as Setting from "../../Setting";
import {Button, Dropdown} from "antd";
import "../../App.less";

function flagIcon(country, alt) {
  return (
    <img width={24} alt={alt} src={`${Setting.StaticBaseUrl}/flag-icons/${country}.svg`} />
  );
}

class LanguageSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props,
      languages: props.languages ?? Setting.Countries.map(item => item.key),
      dark: props.dark ?? false,
    };

    Setting.Countries.forEach((country) => {
      new Image().src = `${Setting.StaticBaseUrl}/flag-icons/${country.country}.svg`;
    });
  }

  items = Setting.Countries.map((country) => Setting.getItem(country.label, country.key, flagIcon(country.country, country.alt)));

  getOrganizationLanguages(languages) {
    const select = [];
    for (const language of languages) {
      this.items.map((item, index) => item.key === language ? select.push(item) : null);
    }
    return select;
  }

  render() {
    const languageItems = this.getOrganizationLanguages(this.state.languages);
    const onClick = (e) => {
      Setting.setLanguage(e.key);
    };
    const currentLanguage = Setting.getLanguage();
    const languageName = languageItems.find((item) => item.key === currentLanguage).label;

    return (
      <Dropdown menu={{items: languageItems, onClick}} >
        <Button style={{
          color: this.state.dark && "white",
          backgroundColor: this.state.dark && "rgba(0, 0, 0, 0)",
        }}>
          <div style={{display: "flex", alignItems: "center", gap: 12}}>
            {languageName}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 7.00037L7.64645 10.6468C7.84171 10.8421 8.15829 10.8421 8.35355 10.6468L12 7.00037" stroke="currentColor" strokeLinecap="round" />
            </svg>
          </div>
        </Button>
      </Dropdown>
    );
  }
}

export default LanguageSelect;
