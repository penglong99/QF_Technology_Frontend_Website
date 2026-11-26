import type { SpecRow } from '../types';
import styles from './SpecificationTable.module.css';

export function SpecificationTable({ rows }: { rows: readonly SpecRow[] }) {
  return (
    <table className={styles.table}>
      <caption className="visually-hidden">Technical specifications</caption>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label}>
            <th scope="row">{row.label}</th>
            <td>{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
