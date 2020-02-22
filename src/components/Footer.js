import React from 'react';
import styled from 'styled-components/macro';
import Anchor from 'components/Anchor';
import { rgba, sectionPadding } from 'utils/style';

const Footer = () => (
  <FooterContainer role="contentinfo">
    <FooterDate>Created by the Death's Shadow Discord </FooterDate>
    <Anchor secondary={1} href="https://github.com/Deaths-Shadow/community-website" target="_blank">Contribute on GitHub</Anchor>
  </FooterContainer>
);

const FooterContainer = styled.footer`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: center;
  width: 100vw;
  padding: 70px 30px;
  z-index: 16;
  position: relative;
  font-size: 16px;
  color: ${props => rgba(props.theme.colorText, 0.6)};
  ${sectionPadding}

  @media (max-width: ${props => props.theme.tablet}px) {
    padding-top: 60px;
    padding-bottom: 60px;
  }

  ${Anchor} {
    display: inline-flex;
  }
`;

const FooterDate = styled.span`
  padding-right: 5px;
  display: inline-flex;
`;

export default Footer;
