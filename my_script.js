function myFunction(){
    if ( typeof myFunction.counter == "undefined") {
        myFunction.counter = 0;
    }
    if (myFunction.counter % 2 == 0){
        document.getElementById("head_button").className = "local_alt_img";
    } else {
        document.getElementById("head_button").className = "local_img";
    }
    myFunction.counter = (myFunction.counter + 1) % 2;
}

var width = 70;
var height = 30;
var queue = [];
var door = [];

function make_array(w, h, val) {
    var arr = [];
    for(let i = 0; i < h; i++) {
        arr[i] = [];
        for(let j = 0; j < w; j++) {
            arr[i][j] = val;
        }
    }
    return arr;
}

var maze = make_array(width, height, 0);

function clear_grid(){
    queue = [];
    door = [];
    console.log("clearing", queue);
    for (let i = 0; i < height; i++){
        for (let j = 0; j < width; j++){
            maze[i][j] = 0;
            document.getElementById(get_cell_name(i,j)).className = "unvisited";
        }
    }
}

function action(){
    clear_grid();
    add_border(width, height);
    div_maze(1, 1, width-2, height-2, -1, -1);
    for (let i = 0; i< queue.length; i++) {
        for (let j = 0; j < door.length; j++){
            if (queue[i] == door[j]){
                queue.splice(i,1);
            }
        }
    }
    mazeGenerationAnimations();
}

// create grid
function create_grid(width, height) {
    let grid_html = "<tbody>";
    for (let i = 0; i < height; i++) {
        grid_html += `<tr id="row_${i}">`;
        for (let j = 0; j < width; j++) {
            grid_html += `<td id="${i}_${j}" class="unvisited"></td>`;  
        }
        grid_html += `</tr>`;
    }
    grid_html += "</tbody>";
    document.getElementById("board").innerHTML = grid_html;
}

function add_border(width, height) {
    for (let y = 0; y < height; y++) {
        document.getElementById(`${y}_${0}`).className = "wall" ;   
        document.getElementById(`${y}_${width-1}`).className = "wall" ;   
    }
    for (let y = 0; y < width; y++) {
        document.getElementById(`${0}_${y}`).className = "wall" ;   
        document.getElementById(`${height-1}_${y}`).className = "wall" ;   
    }
}

function get_cell_name(y, x) {
    return `${y}_${x}`; 
}

function wallify(y,x) {
    maze[y][x] = 1;
    queue.push(get_cell_name(y,x));
}

function get_random_int(min, max) {
    let x = Math.floor(Math.random() * (max - min + 1)) + min;
    return x;
}

function get_type(y, x){
    return document.getElementById(get_cell_name(y, x)).className;
}

function div_maze(top_left_x, top_left_y, bottom_right_x, bottom_right_y, door_x, door_y) {
    let room_width = bottom_right_x - top_left_x + 1;
    let room_height = bottom_right_y - top_left_y + 1;
    // # choose_wall_orientation(room_width, room_height)
    if (((room_width < 2) || (room_height < 2)) || ((room_width == 2) && (room_height == 2))) {
        return;
    }
    let ori = "";
    if (room_width > room_height){
        ori = "ver";
    } else {
        ori = "hor";
    }

    //add_wall()
    if (ori == "hor") {
        let wall_y = get_random_int(top_left_y+1, bottom_right_y-1);
        //add_door()
        let door_x = -1;
        for (let i = top_left_x; i < bottom_right_x+1; i++) {
            wallify(wall_y, i);
        }
        if ((maze[wall_y][top_left_x-1] == 0) 
            && (maze[wall_y-1][top_left_x-1] == 1)
            && (maze[wall_y+1][top_left_x-1] == 1)){
            console.log("hor NO 1");
            door_x = top_left_x;
            door.push(get_cell_name(wall_y, door_x));
            maze[wall_y][door_x] = 0;
        }
        if ((maze[wall_y][bottom_right_x+1] == 0) 
            && (maze[wall_y-1][bottom_right_x+1] == 1)
            && (maze[wall_y+1][bottom_right_x+1] == 1)) {
            console.log("hor NO 2");
            door_x = bottom_right_x;
            door.push(get_cell_name(wall_y, door_x));
            maze[wall_y][door_x] = 0;
        }
        if (door_x == -1) {
            door_x = get_random_int(top_left_x, bottom_right_x);
            door.push(get_cell_name(wall_y, door_x));
            maze[wall_y][door_x] = 0;
        }
        div_maze(top_left_x, top_left_y, bottom_right_x, wall_y-1, door_x, wall_y);
        div_maze(top_left_x, wall_y+1, bottom_right_x, bottom_right_y, door_x, wall_y);
    } else {
        let wall_x = get_random_int(top_left_x+1, bottom_right_x-1);
        for (let i = top_left_y; i < bottom_right_y+1; i++) {
            wallify(i, wall_x);
        }
        //add_door()
        let door_y = -1;
        if ((maze[top_left_y-1][wall_x] == 0) 
            && (maze[top_left_y-1][wall_x-1] == 1)
            && (maze[top_left_y-1][wall_x+1] == 1)){
            console.log("ver NO 1");
            door_y = top_left_y;
            maze[door_y][wall_x] = 0;
            door.push(get_cell_name(door_y, wall_x));
        }
        if ((maze[bottom_right_y+1][wall_x] == 0) 
            && (maze[bottom_right_y+1][wall_x-1] == 1)
            && (maze[bottom_right_y+1][wall_x+1] == 1)) {
            console.log("ver NO 2");
            door_y = bottom_right_y;
            maze[door_y][wall_x] = 0;
            door.push(get_cell_name(door_y, wall_x));
        }
        if (door_y == -1){
            door_y = get_random_int(top_left_y, bottom_right_y);
            maze[door_y][wall_x] = 0;
            door.push(get_cell_name(door_y, wall_x));
        }
        div_maze(top_left_x, top_left_y, wall_x-1, bottom_right_y, wall_x, door_y);
        div_maze(wall_x+1, top_left_y, bottom_right_x, bottom_right_y, wall_x, door_y);
    }
    return;
}

create_grid(width,height);

function mazeGenerationAnimations() {
    let speed = 1;
    function timeout(index) {
        setTimeout(function () {
            if (index === queue.length){
                queue = [];
                return;
            }
            document.getElementById(queue[index]).className = "wall";
            timeout(index + 1);
        }, speed);
    }
    timeout(0);
}
