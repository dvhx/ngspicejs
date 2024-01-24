Goal is to find which oscillator passes most power through coil (614uH 4R) relative to total consumed power.

| Circuit            | Battery current | Coil current    | Gain | f0      |
| ------------------ | ----------------| --------------- | ---- | ------- |
| jfet_colpitts      | 0.4mA           |  3.1mA          |  8.8 | 32.9kHz |
| mosfet_colpitts    | 1.4mA           | 21.9mA          | 15.7 | 32.6kHz |
| npn_colpitts       | 0.6mA           |  4.2mA          |  7.4 | 30.5kHz |
| peltz              | 8.5mA           |  6.4mA          |  0.7 | 31.3kHz |
| rakes              | 4.6mA           | 47.7mA          | 10.3 | 33.4kHz |
| treasure_witcher   | 5.3mA           | 45.6mA          |  8.6 | 33.4kHz |
| two_npn_colpitts   | 2.1mA           | 21.5mA          | 10.4 | 32.7kHz |

