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

function action(){
    add_border(width, height);
    div_maze(1, 1, width-2, height-2, -1, -1);
    mazeGenerationAnimations();
    for (let i = 0; i< queue.length; i++) {
        for (let j = 0; j < door.length; j++){
            if (queue[i] == door[j]){
                queue.splice(i,1);
            }
        }
    }
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

function get_cell_name(x, y) {
    return `${x}_${y}`; 
}

function wallify(x,y) {
    queue.push(get_cell_name(x,y));
    // document.getElementById(get_cell_name(x, y)).className = "wall" ;   
}

function get_random_int(min, max) {
    let x = Math.floor(Math.random() * (max - min + 1)) + min;
    return x;
}

function get_type(x, y){
    return document.getElementById(get_cell_name(x, y)).className;
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
        if ((get_type(wall_y, top_left_x-1) == "unvisited")
            && (get_type(wall_y-1, top_left_x-1) == "wall")
            && (get_type(wall_y+1, top_left_x-1) == "wall")) {
            door_x = top_left_x;
        }
        if ((get_type(wall_y, bottom_right_x+1) == 'unvisited') 
            && (get_type(wall_y-1, bottom_right_x+1) == "wall")
            && (get_type(wall_y+1, bottom_right_x+1) == "wall")) {
            door_x = bottom_right_x;
        }
        if (door_x == -1) {
            door_x = get_random_int(top_left_x, bottom_right_x);
        }
        document.getElementById(get_cell_name(wall_y, door_x)).className = "unvisited";
        door.push(get_cell_name(wall_y, door_x));
        div_maze(top_left_x, top_left_y, bottom_right_x, wall_y-1, door_x, wall_y);
        div_maze(top_left_x, wall_y+1, bottom_right_x, bottom_right_y, door_x, wall_y);
    } else {
        let wall_x = get_random_int(top_left_x+1, bottom_right_x-1);
        for (let i = top_left_y; i < bottom_right_y+1; i++) {
            wallify(i, wall_x);
        }
        //add_door()
        let door_y = -1;
        if ((get_type(top_left_y, wall_x) == 'unvisited') 
            && (get_type(top_left_y-1, wall_x-1) == "wall")
            && (get_type(top_left_y-1, wall_x+1) == "wall")) {
            door_y = top_left_y;
        }
        if ((get_type(bottom_right_y+1, wall_x) == 'unvisited') 
            && (get_type(bottom_right_y+1, wall_x-1) == "wall")
            && (get_type(bottom_right_y+1, wall_x+1) == "wall")) {
            door_y = bottom_right_y;
        }
        if (door_y == -1){
            door_y = get_random_int(top_left_y, bottom_right_y);
        }
        document.getElementById(get_cell_name(door_y, wall_x)).className = "unvisited";
        door.push(get_cell_name(door_y, wall_x));
        div_maze(top_left_x, top_left_y, wall_x-1, bottom_right_y, wall_x, door_y);
        div_maze(wall_x+1, top_left_y, bottom_right_x, bottom_right_y, wall_x, door_y);
    }
    return;
}
//
create_grid(width,height);
//
//
function mazeGenerationAnimations() {
  // let nodes = board.wallsToAnimate.slice(0);
    let speed = 1;
    console.log(queue.length);
    console.log(queue[queue.length-1]);
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
