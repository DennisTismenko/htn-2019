import styled from 'styled-components';

export interface BadgeProps {
  color: string;
}

export const Badge = styled.span<BadgeProps>`
  display: inline-block;
  vertical-align: top;
  padding: 0px 4px;
  border-radius: 16px;
  margin-right: 4px;
  background-color: ${({color}) => color};
`;
