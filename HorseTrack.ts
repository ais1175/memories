import { Random } from "random-js";
import anime from "animejs/lib/anime.es.js";

export default class HorseTrack {
  canvas: HTMLElement;
  number_of_horses: number;
  cooldown: number;
  horse_assets: Array<string>;
  horse_elements: Array<HTMLElement> = [];

  height: number;
  width: number;
  horse_data = {};

  horse_width: number;
  horse_height: number;

  constructor(
    canvas: string,
    horse_assets: Array<string>,
    number_of_horses: number = 4,
    horse_width: number = 8,
    horse_height: number = 8
  ) {
    this.canvas = document.getElementById(canvas);
    this.number_of_horses = number_of_horses;

    this.height = this.canvas.clientHeight;
    this.width = this.canvas.clientWidth;

    this.horse_assets = horse_assets;

    this.horse_width = horse_width;
    this.horse_height = horse_height;
  }



  init(atEnd: Function) {
    for (var i = 0; i < this.number_of_horses; i++) {
      const top = this.percentage(this.horse_height, this.height) * i + 30;
      const src = this.horse_assets[
        this.random(0, this.horse_assets.length - 1)
      ];
      const horse = this.horse_init(src, top);
      horse.id = i.toString();

      this.horse_data[i] = {
        element: horse,
        src: src,
        position: parseInt(horse.style.left.replace("px", "")),
      };

      this.horse_elements.push(horse);
      this.canvas.appendChild(horse);
    }
    this.pause();
  }

  horse_init(src: string, top: number) {
    const img = document.createElement("img");
    img.setAttribute("src", src);
    img.style.position = "absolute";
    //img.style.height = this.percentage(this.horse_height, this.height).toString() + "px";
    //img.style.width = this.percentage(this.horse_width, this.width).toString() + "px";
    img.style.top = top.toString() + "px";
    img.style.left =
      (
        this.width / 10 -
        this.percentage(this.horse_width, this.width) / 10
      ).toString() + "px";
    return img;
  }

  move_to(horse_number: number, desired_percentage: number) {
    const horse_specs: HTMLElement = this.horse_data[horse_number.toString()]
      .element;
    const target = this.percentage(desired_percentage, this.width);
    const current = parseInt(horse_specs.style.left);
    const difference = Math.abs(current - target);

    if (target > current) {
      anime({
        targets: [horse_specs],
        translateX: difference,
      });
    } else if (target < current) {
      anime({
        targets: [horse_specs],
        translateX: -difference,
      });
    }
  }


  pause() {
    Object.keys(this.horse_data).forEach((i) => {
      const src = this.horse_data[i].src.replace("gif", "png");
      this.horse_data[i].element.setAttribute("src", src);
    });
  }

  play() {
    Object.keys(this.horse_data).forEach((i) => {
      const src = this.horse_data[i].src.replace("png", "gif");
      this.horse_data[i].element.setAttribute("src", src);
    });
  }

  countdown(countdown_time: number, callback: Function) {
    var long = countdown_time;
    this.canvas.style.position = "relative";
    const countdown = document.createElement("table");
    countdown.style.background = "#16332e";
    countdown.style.color = "#e6c200";
    countdown.style.opacity = "1";
    countdown.style.fontWeight = "bold";
    countdown.style.fontSize = "150%";
    countdown.style.fontFamily = "Poppins";
    countdown.style.position = "absolute";
    countdown.style.top = "0";
    countdown.style.textAlign = "center";
    countdown.style.width = "150%";
    countdown.style.height = this.height.toString() + "px";

    const tr = document.createElement("tr");
    const td = document.createElement("td");
    const timer_text = document.createElement("span");
    timer_text.innerHTML = countdown_time.toString();

    td.appendChild(timer_text);
    tr.appendChild(td);
    countdown.appendChild(tr);
    this.canvas.appendChild(countdown);
    this.pause();

    this.counter(
      countdown_time,
      () => {
        timer_text.innerHTML = long.toString();
        long -= 1;
      },
      () => {
        countdown.outerHTML = "";
        this.play();
        callback();
      }
    );
  }

  counter(how_long: number, onTick: Function, onEnd: Function) {
    const count = () => {
      onTick();

      if (how_long > 1) {
        setTimeout(() => {
          count();
          how_long -= 1;
        }, 1000);
      } else {
        onEnd();
      }
    };
    count();
  }

  reset() {
    this.canvas.innerHTML = "";
  }

  percentage(partialValue: number, totalValue: number) {
    return (partialValue / 100) * totalValue;
  }

  random(min: number, max: number) {
    const random = new Random();
    return random.integer(min, max);
  }
}
