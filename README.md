# METUnic Priority Caching (Node.js)

## Installation

### Install npm:
```
npm install
```

### Create Docker image:
```
docker build -t metunic-priority-caching-nodejs .
```

### Run Docker container:
```
docker run -e INPUT_PATH=input000.txt -e OUTPUT_PATH=output.txt -v $(pwd):/app metunic-priority-caching-nodejs
```

#### Input Format For Custom Testing

- The first line contains an integer, n, the number of log entries.
- The next line contains an integer, 2, the number of parameters to describe a log entry.
- Each line i of the n subsequent lines (where 0 ≤ i < n) contains the log entry in the form described above.

---
## Step-by-Step Explanation

### Input:
The system receives a sequence of log entries denoting calls made to memory items. Each log entry consists of a timestamp and an item ID.

Example `callLogs` input:
```
[
    [1, 1],
    [2, 1],
    [3, 1],
    [4, 2],
    [5, 2],
    [6, 2]
]
```

### Process:

1. **First Access to Item 1 (`[1, 1]`):**
   - Priority (`priority`): Starts at `0` (new item)
   - Access Count (`accessCount`): Starts at `0`
   - Priority Update:
     - Since it's the first access, priority increases by `2` (now `2`)
   - Item is not cached (priority less than or equal to `5`)

2. **Second Access to Item 1 (`[2, 1]`):**
    - Priority Update:
      - Time difference (`timestamp - lastAccessTime`) is `2 - 1 = 1`
      - Priority decreases by `1` (now `1`)
      - Access Count increments to `1`
      - Priority increases by `2` (now `3`)
    - Item is not cached (priority less than or equal to `5`)

3. **Third Access to Item 1 (`[3, 1]`):**
    - Priority Update:
        - Time difference is `3 - 2 = 1`
        - Priority decreases by `1` (now `2`)
        - Access Count increments to `2`
        - Priority increases by `2` (now `4`)
    - Item is not cached (priority less than or equal to `5`)

4. **First Access to Item 2 (`[4, 2]`):**
    - Priority (`priority`): Starts at `0` (new item)
    - Access Count (`accessCount`): Starts at `0`
    - Priority Update:
        - Since it's the first access, priority increases by `2` (now `2`)
    - Item is not cached (priority less than or equal to `5`)

5. **Second Access to Item 2 (`[5, 2]`):**
    - Priority Update:
        - Time difference (`timestamp - lastAccessTime`) is `5 - 4 = 1`
        - Priority decreases by `1` (now `1`)
        - Access Count increments to `1`
        - Priority increases by `2` (now `3`)
    - Item is not cached (priority less than or equal to `5`)

6. **Third Access to Item 2 (`[6, 2]`):**
    - Priority Update:
        - Time difference is `6 - 5 = 1`
        - Priority decreases by `1` (now `2`)
        - Access Count increments to `2`
        - Priority increases by `2` (now `4`)
    - Item is cached (priority exceeds `5`)

### Output:
The function should return the IDs of items that are currently cached in ascending order.

For the given `callLogs`, the expected cached items are `[1, 2]`.